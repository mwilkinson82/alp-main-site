import marshallCasual from "@/assets/marshall-casual.jpg";

const WelcomeVideo = () => {
  return (
    <section id="welcome" className="relative pt-32 pb-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto space-y-8 text-center">
          <header>
            <p className="text-primary text-sm font-bold tracking-widest uppercase px-4 py-2 bg-primary/10 rounded-full border border-primary/20 inline-block">
              Welcome
            </p>
            <h2 className="mt-4 text-4xl md:text-6xl font-bold text-foreground">
              A Personal Welcome From Marshall
            </h2>
            <p className="mt-4 text-lg md:text-xl text-muted-foreground">
              Watch the short welcome message below. Play it when you’re ready—no autoplay.
            </p>
          </header>

          <div className="rounded-xl border border-primary/20 shadow-elegant overflow-hidden">
            <div className="relative w-full" style={{ aspectRatio: "16 / 9" }}>
              <video
                controls
                playsInline
                preload="metadata"
                poster={marshallCasual}
                className="absolute inset-0 w-full h-full object-cover bg-background"
                aria-label="Welcome video from Marshall Wilkinson"
              >
                <source src="/videos/welcome-background.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WelcomeVideo;
