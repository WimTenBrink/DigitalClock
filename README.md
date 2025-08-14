# Interactive Digital Clock & Weather Display

This is a modern, visually appealing web application that combines a digital clock, interactive "googly" eyes, and a real-time weather display. It's built with React, TypeScript, and Tailwind CSS.

## Features

-   **Digital Clock**: Displays the current time (HH:MM:SS) and date, updating every second.
-   **Interactive Eyes**: A pair of eyes that follow your mouse cursor's movement around the screen, complete with a natural blinking effect.
-   **Weather Display**: Shows the current weather for your location using the browser's Geolocation API. It defaults to Amsterdam if location access is unavailable or denied.
-   **Responsive Design**: The layout adjusts smoothly to different screen sizes.

## How to Run

This project is set up to run directly in the browser without a dedicated build step.

1.  Clone or download all the files.
2.  Open the `index.html` file in a modern web browser.

Alternatively, you can serve the project directory using a simple local server. For example, if you have Python installed:

```bash
# In the project directory, run:
python -m http.server
```
Then, navigate to `http://localhost:8000` in your browser.

## Project Structure

-   `index.html`: The main entry point of the application.
-   `index.tsx`: The React root that renders the `App` component.
-   `App.tsx`: The main application component that structures the layout.
-   `components/`: Contains the individual React components:
    -   `Clock.tsx`: The digital clock display.
    -   `Eyes.tsx`: The interactive eyes feature.
    -   `Weather.tsx`: The weather display feature.
-   `metadata.json`: Application metadata.
-   `.gitignore`: Specifies files for Git to ignore.
-   `LICENSE.md`: The open-source license for the project.
