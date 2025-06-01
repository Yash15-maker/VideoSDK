### Meeting Timeline Tracker
This project shows a timeline of meeting participants and their activity during the meeting. It displays when participants joined, left, muted/unmuted, turned their camera on/off, shared their screen, disconnected, or had an error.

## Features
Visual timeline of each participant

Icons for mic, camera, screen share, errors, disconnects

Shows when each user was active

Uses percentages to place events correctly based on time

## How to Run
Clone the repo
git clone <repo-url>

Install dependencies
npm install

Start the app
npm run dev or npm start

Files
MeetingTimeline.js: Main component that renders the timeline

meetingData: Can be passed as a prop or use the mock data inside the component

Tech Used
React

Tailwind CSS (for styling)

Lucide-react (for icons)

Notes
All event times are converted to percentage widths to align them on the timeline

The component will show mock data if no props are passed

Time markers are shown every 2 minutes

