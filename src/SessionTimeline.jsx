import { useState } from "react";
import {
  Users,
  Mic,
  Video,
  Monitor,
  Clock,
  AlertTriangle,
  LogIn,
  LogOut,
  Wifi,
  WifiOff,
  Eye,
  EyeOff,
} from "lucide-react";

export default function MeetingTimeline({ meetingData }) {
  const [showParticipantTimeline, setShowParticipantTimeline] = useState(true);

  // Mock data for demonstration purposes
  const mockMeetingData = meetingData || {
    start: "2024-01-15T10:00:00Z",
    end: "2024-01-15T10:20:00Z",
    participantArray: [
      {
        participantId: "P001",
        name: "John Doe",
        timelog: [
          { start: "2024-01-15T10:00:00Z", end: "2024-01-15T10:15:00Z" },
          { start: "2024-01-15T10:16:00Z", end: "2024-01-15T10:20:00Z" },
        ],
        events: {
          mic: [{ start: "2024-01-15T10:02:00Z", end: "2024-01-15T10:08:00Z" }],
          webcam: [
            { start: "2024-01-15T10:01:00Z", end: "2024-01-15T10:12:00Z" },
          ],
          screenShare: [
            { start: "2024-01-15T10:05:00Z", end: "2024-01-15T10:10:00Z" },
          ],
          errors: [{ start: "2024-01-15T10:07:00Z" }],
        },
      },
      {
        participantId: "P002",
        name: "Jane Smith",
        timelog: [
          { start: "2024-01-15T10:01:00Z", end: "2024-01-15T10:20:00Z" },
        ],
        events: {
          mic: [{ start: "2024-01-15T10:03:00Z", end: "2024-01-15T10:18:00Z" }],
          webcam: [
            { start: "2024-01-15T10:02:00Z", end: "2024-01-15T10:19:00Z" },
          ],
          screenShare: [],
          errors: [],
        },
      },
    ],
  };

  const meetingStart = new Date(mockMeetingData.start);
  const meetingEnd = new Date(mockMeetingData.end);
  const totalDuration = meetingEnd - meetingStart;

  // Function to generate time markers for the timeline
  const generateTimeMarkers = () => {
    const markers = [];
    for (let i = 0; i <= 20; i += 2) {
      const time = new Date(meetingStart.getTime() + i * 60000);
      markers.push({
        time: time.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
        }),
        position: (i / 20) * 100,
      });
    }
    return markers;
  };

  const timeMarkers = generateTimeMarkers();
  
  // Function to calculate the position of an event on the timeline
  const getPositionOnTimeline = (timestamp) => {
    const eventTime = new Date(timestamp);
    const elapsed = eventTime - meetingStart;
    return Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100);
  };

  // Function to format time in HH:MM format
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (start, end) => {
    const duration = new Date(end) - new Date(start);
    const minutes = Math.floor(duration / 60000);
    return `${minutes} mins`;
  };

  // Function to check if a participant has dropped off
  const isDropOff = (participant, timelogIndex) => {
    if (timelogIndex < participant.timelog.length - 1) {
      const currentEnd = new Date(participant.timelog[timelogIndex].end);
      const nextStart = new Date(participant.timelog[timelogIndex + 1].start);
      return nextStart - currentEnd > 60000;
    }
    return false;
  };
  
  // Toggle function for showing/hiding participant timeline
  const toggleParticipantTimeline = () => {
    setShowParticipantTimeline(!showParticipantTimeline);
  };

  return (
    <div className="bg-gray-900 w-full text-white p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-medium flex items-center gap-2">
          <Users className="w-5 h-5" />
          Participants wise Session Timeline
        </h1>
        <label className="text-sm text-blue-400 hover:text-blue-300 cursor-pointer flex items-center gap-2 transition-colors">
          <input
            type="checkbox"
            checked={showParticipantTimeline}
            onChange={toggleParticipantTimeline}
            className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
          />
          Show participant timeline
        </label>
      </div>

      {showParticipantTimeline && (
        <>
          <div className="relative mb-8">
            <div className="flex justify-between text-xs text-gray-400 mb-2">
              {timeMarkers.map((marker, index) => (
                <div key={index} className="text-center">
                  {marker.time}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8 w-full">
            {mockMeetingData.participantArray.map((participant) => (
              <div key={participant.participantId} className="relative">
                <div className="mb-4">
                  <h3 className="text-white font-medium mb-1">
                    {participant.name} ({participant.participantId})
                  </h3>
                  <div className="text-sm text-gray-400">
                    {formatTime(participant.timelog[0].start)} | Duration{" "}
                    {formatDuration(
                      participant.timelog[0].start,
                      participant.timelog[participant.timelog.length - 1].end
                    )}
                  </div>
                </div>

                <div className="relative h-16 bg-gray-800 rounded-lg mb-4">
                  <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-700 transform -translate-y-1/2"></div>

                  {participant.timelog.map((session, sessionIndex) => {
                    const startPos = getPositionOnTimeline(session.start);
                    const endPos = getPositionOnTimeline(session.end);
                    const width = endPos - startPos;

                    return (
                      <div
                        key={sessionIndex}
                        className="absolute top-1/2 h-2 bg-blue-500 transform -translate-y-1/2 rounded"
                        style={{
                          left: `${startPos}%`,
                          width: `${width}%`,
                        }}
                      ></div>
                    );
                  })}

                  {participant.timelog.map((session, sessionIndex) => {
                    const startPos = getPositionOnTimeline(session.start);
                    const endPos = getPositionOnTimeline(session.end);
                    return (
                      <div key={`join-${sessionIndex}`}>
                        <div
                          className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 z-10"
                          style={{
                            left: `${Math.max(3, Math.min(97, startPos))}%`,
                          }}
                        >
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-gray-900">
                            <LogIn className="w-3 h-3 text-white" />
                          </div>
                        </div>

                        <div
                          className="absolute top-1/2 transform -translate-y-1/2 translate-x-1/2 z-10"
                          style={{
                            left: `${Math.max(3, Math.min(97, endPos))}%`,
                          }}
                        >
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center border-2 border-gray-900 ${
                              isDropOff(participant, sessionIndex)
                                ? "bg-red-500"
                                : "bg-orange-500"
                            }`}
                          >
                            {isDropOff(participant, sessionIndex) ? (
                              <WifiOff className="w-3 h-3 text-white" />
                            ) : (
                              <LogOut className="w-3 h-3 text-white" />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {participant.events.mic.map((micEvent, micIndex) => (
                    <div key={`mic-${micIndex}`}>
                      <div
                        className="absolute top-2 transform -translate-x-1/2 z-10"
                        style={{
                          left: `${Math.max(
                            3,
                            Math.min(97, getPositionOnTimeline(micEvent.start))
                          )}%`,
                        }}
                      >
                        <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                          <Mic className="w-3 h-3 text-white" />
                        </div>
                      </div>
                      <div
                        className="absolute top-2 transform translate-x-1/2 z-10"
                        style={{
                          left: `${Math.max(
                            3,
                            Math.min(97, getPositionOnTimeline(micEvent.end))
                          )}%`,
                        }}
                      >
                        <div className="w-5 h-5 bg-gray-600 rounded-full flex items-center justify-center">
                          <Mic className="w-3 h-3 text-white opacity-50" />
                        </div>
                      </div>
                    </div>
                  ))}

                  {participant.events.webcam.map((camEvent, camIndex) => (
                    <div key={`cam-${camIndex}`}>
                      <div
                        className="absolute bottom-2 transform -translate-x-1/2 z-10"
                        style={{
                          left: `${Math.max(
                            3,
                            Math.min(97, getPositionOnTimeline(camEvent.start))
                          )}%`,
                        }}
                      >
                        <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center">
                          <Video className="w-3 h-3 text-white" />
                        </div>
                      </div>
                      <div
                        className="absolute bottom-2 transform translate-x-1/2 z-10"
                        style={{
                          left: `${Math.max(
                            3,
                            Math.min(97, getPositionOnTimeline(camEvent.end))
                          )}%`,
                        }}
                      >
                        <div className="w-5 h-5 bg-gray-600 rounded-full flex items-center justify-center">
                          <Video className="w-3 h-3 text-white opacity-50" />
                        </div>
                      </div>
                    </div>
                  ))}

                  {participant.events.screenShare.map(
                    (screenEvent, screenIndex) => (
                      <div key={`screen-${screenIndex}`}>
                        <div
                          className="absolute top-0 transform -translate-x-1/2 z-10"
                          style={{
                            left: `${Math.max(
                              3,
                              Math.min(
                                97,
                                getPositionOnTimeline(screenEvent.start)
                              )
                            )}%`,
                          }}
                        >
                          <div className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center">
                            <Monitor className="w-3 h-3 text-white" />
                          </div>
                        </div>
                        <div
                          className="absolute top-0 transform translate-x-1/2 z-10"
                          style={{
                            left: `${Math.max(
                              3,
                              Math.min(
                                97,
                                getPositionOnTimeline(screenEvent.end)
                              )
                            )}%`,
                          }}
                        >
                          <div className="w-5 h-5 bg-gray-600 rounded-full flex items-center justify-center">
                            <Monitor className="w-3 h-3 text-white opacity-50" />
                          </div>
                        </div>
                      </div>
                    )
                  )}

                  {participant.events.errors &&
                    participant.events.errors.map((error, errorIndex) => (
                      <div
                        key={`error-${errorIndex}`}
                        className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 z-20"
                        style={{
                          left: `${Math.max(
                            3,
                            Math.min(97, getPositionOnTimeline(error.start))
                          )}%`,
                        }}
                      >
                        <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center border-2 border-gray-900 animate-pulse">
                          <AlertTriangle className="w-3 h-3 text-white" />
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {!showParticipantTimeline && (
        <div className="text-center py-12 text-gray-500">
          <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Participant timeline is hidden</p>
        </div>
      )}
    </div>
  );
}
