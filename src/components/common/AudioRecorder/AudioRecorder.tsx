"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Square } from "lucide-react";
import { useIsMobile } from "@/hooks/useIsMobile";

interface AudioRecorderProps {
  onRecordFinish?: (audioBlob: Blob) => void;
}

export const AudioRecorder = ({ onRecordFinish }: AudioRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const isMobile = useIsMobile();

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRecording) {
      setDuration(0);
      intervalRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRecording]);

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        onRecordFinish?.(audioBlob);

        // Stop all tracks to release microphone
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error starting recording:", err);
    }
  }, [onRecordFinish]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  const handleClick = () => {
    if (!isMobile) {
      if (isRecording) {
        stopRecording();
      } else {
        startRecording();
      }
    }
  };

  const handleMouseDown = () => {
    if (isMobile && !isRecording) {
      startRecording();
    }
  };

  const handleMouseUp = () => {
    if (isMobile && isRecording) {
      stopRecording();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    if (!isRecording) {
      startRecording();
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    if (isRecording) {
      stopRecording();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="text-lg font-mono font-bold h-6 flex items-center justify-center">
        {isRecording ? (
          <span className="text-red-500 animate-pulse">{formatDuration(duration)}</span>
        ) : (
          <span className="text-transparent">0:00</span>
        )}
      </div>

      <Button
        variant={isRecording ? "destructive" : "default"}
        size="lg"
        className="w-24 h-24 rounded-full flex items-center justify-center"
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {isRecording ? (
          <Square className="!w-6 !h-6" />
        ) : (
          <Mic className="!w-6 !h-6" />
        )}
      </Button>

      <p className="text-sm text-muted-foreground text-center">
        {isMobile
          ? isRecording
            ? "Release to stop recording"
            : "Hold to record"
          : isRecording
          ? "Click to stop recording"
          : "Click to start recording"}
      </p>
    </div>
  );
};
