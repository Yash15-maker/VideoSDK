import sessionData from "./assets/sessionData";
import MeetingTimeline from "./SessionTimeline";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 py-3 px-0.5">
      <div className="w-full mx-auto">
        <MeetingTimeline meetingData={sessionData} />
      </div>
    </div>
  );
}

export default App;
