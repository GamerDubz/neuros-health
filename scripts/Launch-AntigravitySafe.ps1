param(
    [string]$AntigravityExe = 'C:\Users\thema\AppData\Local\Programs\Antigravity\Antigravity.exe'
)

$ErrorActionPreference = 'Stop'

function Get-RepoRoots {
    $roots = [System.Collections.Generic.HashSet[string]]::new([System.StringComparer]::OrdinalIgnoreCase)
    $candidates = @(
        'C:\Users\thema\OneDrive\Documents',
        'C:\Users\thema\OneDrive\Desktop',
        'C:\Users\thema\Downloads',
        'C:\Users\thema\source\repos',
        'C:\Users\thema\Projects'
    )

    foreach ($candidate in $candidates) {
        if (Test-Path -LiteralPath $candidate) {
            [void]$roots.Add($candidate)
        }
    }

    $storageFiles = @(
        'C:\Users\thema\AppData\Roaming\Antigravity\User\globalStorage\storage.json',
        'C:\Users\thema\AppData\Roaming\antigravity\User\globalStorage\storage.json'
    )

    foreach ($storageFile in $storageFiles) {
        if (-not (Test-Path -LiteralPath $storageFile)) {
            continue
        }

        try {
            $storage = Get-Content -LiteralPath $storageFile -Raw | ConvertFrom-Json -ErrorAction Stop
            $uriValues = [System.Collections.Generic.List[string]]::new()

            if ($storage.backupWorkspaces.folders) {
                foreach ($folder in $storage.backupWorkspaces.folders) {
                    if ($folder.folderUri) {
                        $uriValues.Add($folder.folderUri)
                    }
                }
            }

            if ($storage.profileAssociations.workspaces) {
                foreach ($item in $storage.profileAssociations.workspaces.PSObject.Properties) {
                    $uriValues.Add($item.Name)
                }
            }

            if ($storage.windowsState.lastActiveWindow.folder) {
                $uriValues.Add($storage.windowsState.lastActiveWindow.folder)
            }

            foreach ($uriValue in $uriValues) {
                if ([string]::IsNullOrWhiteSpace($uriValue) -or -not $uriValue.StartsWith('file:///')) {
                    continue
                }

                try {
                    $path = [System.Uri]::UnescapeDataString(($uriValue -replace '^file:///', '')) -replace '/', '\'
                    if ($path -match '^[A-Za-z]:\\' -and (Test-Path -LiteralPath $path)) {
                        [void]$roots.Add($path)
                    }
                }
                catch {
                }
            }
        }
        catch {
        }
    }

    return $roots
}

function Repair-GitConfig {
    param(
        [Parameter(Mandatory = $true)]
        [string]$ConfigPath
    )

    $lines = Get-Content -LiteralPath $ConfigPath -ErrorAction Stop
    $output = [System.Collections.Generic.List[string]]::new()
    $sectionBuffer = [System.Collections.Generic.List[string]]::new()
    $currentSection = ''
    $changed = $false
    $hasWorktreeConfig = $false
    $hasRetainedExtensions = $false
    $sawCoreVersion = $false

    $scanSection = ''
    foreach ($line in $lines) {
        if ($line -match '^\s*\[(.+?)\]\s*$') {
            $scanSection = $Matches[1].Trim().ToLowerInvariant()
            continue
        }

        if ($scanSection -eq 'extensions' -and $line -match '^\s*(\S+)\s*=') {
            if ($Matches[1].ToLowerInvariant() -eq 'worktreeconfig') {
                $hasWorktreeConfig = $true
            }
            else {
                $hasRetainedExtensions = $true
            }
        }
    }

    if (-not $hasWorktreeConfig -and -not ($lines -match '(?im)^\[lfs\][\s\S]*?^\s*repositoryformatversion\s*=')) {
        return $false
    }

    function Flush-SectionBuffer {
        param(
            [System.Collections.Generic.List[string]]$Buffer,
            [string]$SectionName
        )

        if ($SectionName -ieq 'extensions') {
            if ($Buffer.Count -gt 1) {
                foreach ($entry in $Buffer) {
                    $output.Add($entry)
                }
            }
        }
        else {
            foreach ($entry in $Buffer) {
                $output.Add($entry)
            }
        }

        $Buffer.Clear()
    }

    foreach ($line in $lines) {
        if ($line -match '^\s*\[(.+?)\]\s*$') {
            Flush-SectionBuffer -Buffer $sectionBuffer -SectionName $currentSection
            $currentSection = $Matches[1].Trim().ToLowerInvariant()
            $sectionBuffer.Add($line)
            continue
        }

        if ($currentSection -eq 'extensions') {
            if ($line -match '^\s*worktreeConfig\s*=') {
                $changed = $true
                continue
            }

            if ($line -match '^\s*\S+\s*=') {
                $hasRetainedExtensions = $true
            }

            $sectionBuffer.Add($line)
            continue
        }

        if ($currentSection -eq 'lfs' -and $line -match '^\s*repositoryformatversion\s*=') {
            $changed = $true
            continue
        }

        if ($currentSection -eq 'core' -and $line -match '^\s*repositoryformatversion\s*=') {
            $desiredVersion = if ($hasRetainedExtensions) { '1' } else { '0' }
            $updatedLine = "`trepositoryformatversion = $desiredVersion"
            if ($line.Trim() -ne $updatedLine.Trim()) {
                $changed = $true
            }
            $sectionBuffer.Add($updatedLine)
            $sawCoreVersion = $true
            continue
        }

        $sectionBuffer.Add($line)
    }

    Flush-SectionBuffer -Buffer $sectionBuffer -SectionName $currentSection

    $normalized = [System.Collections.Generic.List[string]]::new()
    $previousBlank = $false
    foreach ($line in $output) {
        $isBlank = [string]::IsNullOrWhiteSpace($line)
        if ($isBlank -and $previousBlank) {
            continue
        }

        $normalized.Add($line)
        $previousBlank = $isBlank
    }

    if (-not $sawCoreVersion) {
        return $false
    }

    if (-not $changed) {
        return $false
    }

    $backupPath = "$ConfigPath.antigravity-backup"
    if (-not (Test-Path -LiteralPath $backupPath)) {
        Copy-Item -LiteralPath $ConfigPath -Destination $backupPath -Force
    }

    [System.IO.File]::WriteAllLines($ConfigPath, $normalized)
    return $true
}

function Find-AffectedRepos {
    $repos = [System.Collections.Generic.HashSet[string]]::new([System.StringComparer]::OrdinalIgnoreCase)

    foreach ($root in Get-RepoRoots) {
        Get-ChildItem -Path $root -Recurse -Force -Filter config -ErrorAction SilentlyContinue |
            Where-Object { $_.FullName -match '\\.git\\config$' } |
            ForEach-Object {
                $configPath = $_.FullName
                $content = Get-Content -LiteralPath $configPath -ErrorAction SilentlyContinue
                if (-not $content) {
                    return
                }

                if ($content -match '(?im)^\s*worktreeConfig\s*=' -or $content -match '(?im)^\[lfs\][\s\S]*?^\s*repositoryformatversion\s*=') {
                    $repo = Split-Path (Split-Path $configPath -Parent) -Parent
                    [void]$repos.Add($repo)
                }
            }
    }

    return $repos
}

if (-not (Test-Path -LiteralPath $AntigravityExe)) {
    throw "Antigravity executable not found: $AntigravityExe"
}

$repaired = [System.Collections.Generic.List[string]]::new()
foreach ($repo in Find-AffectedRepos) {
    $configPath = Join-Path $repo '.git\config'
    if (Test-Path -LiteralPath $configPath) {
        if (Repair-GitConfig -ConfigPath $configPath) {
            $repaired.Add($repo)
        }
    }
}

$logDir = 'C:\Users\thema\AppData\Roaming\Antigravity'
if (Test-Path -LiteralPath $logDir) {
    $statusPath = Join-Path $logDir 'antigravity-safe-launch.log'
    $stamp = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
    $message = if ($repaired.Count -gt 0) {
        "$stamp Repaired: $($repaired -join '; ')"
    }
    else {
        "$stamp No repo config repairs were needed."
    }
    Add-Content -LiteralPath $statusPath -Value $message
}

Start-Process -FilePath $AntigravityExe -WorkingDirectory (Split-Path $AntigravityExe -Parent)
