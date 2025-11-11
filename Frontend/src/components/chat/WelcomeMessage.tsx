export default function WelcomeMessage() {
  return (
    <div className="flex-1 flex items-center justify-center px-4">
      <div className="max-w-2xl space-y-6">
        <p className="text-foreground text-lg">
          Hi there! How can I help today? I can:
        </p>
        <ul className="space-y-3">
          <li className="flex items-start space-x-3">
            <span className="text-muted-foreground mt-1">•</span>
            <span className="text-muted-foreground">
              Check weather and provide a 5-day forecast for a location
            </span>
          </li>
          <li className="flex items-start space-x-3">
            <span className="text-muted-foreground mt-1">•</span>
            <span className="text-muted-foreground">
              Create simple time-series charts from your data
            </span>
          </li>
          <li className="flex items-start space-x-3">
            <span className="text-muted-foreground mt-1">•</span>
            <span className="text-muted-foreground">
              Explain concepts, draft emails, or help with writing
            </span>
          </li>
          <li className="flex items-start space-x-3">
            <span className="text-muted-foreground mt-1">•</span>
            <span className="text-muted-foreground">
              Answer questions or brainstorm ideas
            </span>
          </li>
        </ul>
        <p className="text-muted-foreground">
          Tell me what you'd like to do or the details you have, and I'll get started.
        </p>
      </div>
    </div>
  );
}
