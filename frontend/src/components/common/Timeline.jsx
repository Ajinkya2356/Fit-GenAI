import * as React from "react";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import TimelineOppositeContent, {
  timelineOppositeContentClasses,
} from "@mui/lab/TimelineOppositeContent";

export default function CustomTimeline({ list }) {
  const LabelToIcon = {
    start: <PlayArrowIcon />,
    end: <PauseIcon />,
  };
  return (
    <Timeline
      sx={{
        [`& .${timelineOppositeContentClasses.root}`]: {
          flex: 1,
        },
      }}
    >
      {list.map((item, index) => {
        return (
          <TimelineItem key={index}>
            <TimelineOppositeContent color="black ">
              {item.label}
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot
                style={{
                  backgroundColor: item.color,
                }}
              >
                {LabelToIcon[item.title.toLowerCase()] || <PlayArrowIcon />}
              </TimelineDot>
              {index < list.length - 1 && <TimelineConnector />}
            </TimelineSeparator>
            <TimelineContent color="black">{item.title}</TimelineContent>
          </TimelineItem>
        );
      })}
    </Timeline>
  );
}
