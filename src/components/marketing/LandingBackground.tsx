export function LandingBackground() {
  return (
    <>
      <div className="fixed bottom-[-96px] left-[-96px] w-[320px] h-[320px] bg-primary-container/5 rounded-full blur-[60px] pointer-events-none -z-10 animate-glow-pulse" />
      <div
        className="fixed top-[-96px] right-[-96px] w-[320px] h-[320px] bg-secondary/5 rounded-full blur-[60px] pointer-events-none -z-10 animate-glow-pulse"
        style={{ animationDelay: "2s" }}
      />
      <div className="absolute bottom-[-30px] right-[10%] w-[500px] h-[500px] bg-primary-fixed/15 blur-[100px] -z-10 animate-glow-pulse" />
      <div
        className="absolute top-[10%] left-[10%] w-[400px] h-[400px] bg-secondary-fixed/10 blur-[80px] -z-10 animate-glow-pulse"
        style={{ animationDelay: "4s" }}
      />
    </>
  );
}
