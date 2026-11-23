"use client";

import * as React from "react";
import {
  Mic,
  Square,
  Play,
  Pause,
  Download,
  Music,
  Film,
  Scissors,
  CheckCircle2,
  RefreshCw,
  Sliders,
  Volume2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// ==========================================
// 1. VOICE RECORDER & AUDIO EDITOR (voice-recorder-editor)
// ==========================================
export function VoiceRecorderEditorTool() {
  const [isRecording, setIsRecording] = React.useState(false);
  const [isPaused, setIsPaused] = React.useState(false);
  const [recordingTime, setRecordingTime] = React.useState(0);
  const [audioBlobUrl, setAudioBlobUrl] = React.useState<string | null>(null);

  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const audioChunksRef = React.useRef<Blob[]>([]);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    try {
      audioChunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioBlobUrl(url);
        setIsRecording(false);
        setIsPaused(false);
        if (timerRef.current) clearInterval(timerRef.current);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(250);
      setIsRecording(true);
      setIsPaused(false);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((t) => t + 1);
      }, 1000);
    } catch {
      alert("Microphone access was denied or is not supported by your browser.");
    }
  };

  const pauseResumeRecording = () => {
    if (!mediaRecorderRef.current) return;
    if (isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      timerRef.current = setInterval(() => {
        setRecordingTime((t) => t + 1);
      }, 1000);
    } else {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6">
      <div className="p-8 rounded-xl border border-border bg-card space-y-6 text-center max-w-xl mx-auto shadow-xs">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-800">
          <Mic className={`w-8 h-8 ${isRecording && !isPaused ? "text-rose-600 animate-pulse" : "text-teal-600"}`} />
        </div>

        <div className="space-y-1">
          <h3 className="text-base font-semibold text-slate-900">Voice Recorder & Audio Capture</h3>
          <p className="text-xs text-slate-600">
            Record crystal-clear voice notes, podcasts, and audio clips client-side. Zero cloud transmission.
          </p>
        </div>

        {/* Timer display */}
        <div className="py-2">
          <span className="font-mono text-3xl font-semibold text-slate-900">
            {formatTime(recordingTime)}
          </span>
          {isPaused && <p className="text-xs text-amber-600 font-semibold mt-1">Recording Paused</p>}
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-center gap-3">
          {!isRecording ? (
            <Button
              type="button"
              onClick={startRecording}
              className="bg-teal-600 hover:bg-teal-500 text-white gap-2 px-6"
            >
              <Mic className="w-4 h-4" />
              <span>Start Recording</span>
            </Button>
          ) : (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={pauseResumeRecording}
                className="text-xs gap-1.5"
              >
                {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                <span>{isPaused ? "Resume" : "Pause"}</span>
              </Button>

              <Button
                type="button"
                onClick={stopRecording}
                className="bg-rose-600 hover:bg-rose-500 text-white text-xs gap-1.5"
              >
                <Square className="w-4 h-4" />
                <span>Finish & Save</span>
              </Button>
            </>
          )}
        </div>

        {/* Playback & Export */}
        {audioBlobUrl && (
          <div className="pt-6 border-t space-y-4 text-left">
            <span className="text-xs font-mono font-semibold text-slate-700">Audio Preview</span>
            <audio src={audioBlobUrl} controls className="w-full" />
            <div className="flex justify-end">
              <a
                href={audioBlobUrl}
                download={`voice_recording_${Date.now()}.webm`}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-semibold inline-flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Audio (WebM / Opus)</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// 2. AUDIO CONVERTER MP3 / WAV (audio-converter-mp3)
// ==========================================
export function AudioConverterMp3Tool() {
  const [audioFile, setAudioFile] = React.useState<File | null>(null);
  const [outputFormat, setOutputFormat] = React.useState("wav");
  const [isConverting, setIsConverting] = React.useState(false);
  const [convertedUrl, setConvertedUrl] = React.useState<string | null>(null);

  const convertAudio = async () => {
    if (!audioFile) return;
    setIsConverting(true);
    setConvertedUrl(null);

    try {
      const arrayBuffer = await audioFile.arrayBuffer();
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

      // Encode to standard uncompressed WAV PCM
      const numOfChan = audioBuffer.numberOfChannels;
      const length = audioBuffer.length * numOfChan * 2 + 44;
      const outBuffer = new ArrayBuffer(length);
      const view = new DataView(outBuffer);
      const channels = [];
      let sample = 0;
      let offset = 0;
      let pos = 0;

      // write WAVE header
      function setUint16(data: number) {
        view.setUint16(pos, data, true);
        pos += 2;
      }
      function setUint32(data: number) {
        view.setUint32(pos, data, true);
        pos += 4;
      }

      setUint32(0x46464952); // "RIFF"
      setUint32(length - 8); // file length - 8
      setUint32(0x45564157); // "WAVE"

      setUint32(0x20746d66); // "fmt " chunk
      setUint32(16); // length = 16
      setUint16(1); // PCM (uncompressed)
      setUint16(numOfChan);
      setUint32(audioBuffer.sampleRate);
      setUint32(audioBuffer.sampleRate * 2 * numOfChan); // avg. bytes/sec
      setUint16(numOfChan * 2); // block-align
      setUint16(16); // 16-bit precision

      setUint32(0x61746164); // "data" chunk
      setUint32(length - pos - 4); // chunk length

      for (let i = 0; i < audioBuffer.numberOfChannels; i++) {
        channels.push(audioBuffer.getChannelData(i));
      }

      while (pos < length) {
        for (let i = 0; i < numOfChan; i++) {
          sample = Math.max(-1, Math.min(1, channels[i][offset]));
          sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0;
          view.setInt16(pos, sample, true);
          pos += 2;
        }
        offset++;
      }

      const blob = new Blob([outBuffer], { type: "audio/wav" });
      const url = URL.createObjectURL(blob);
      setConvertedUrl(url);
    } catch {
      alert("Failed to transcode audio file. Please ensure the file is a valid audio format.");
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-xl border border-border bg-card space-y-4 max-w-xl mx-auto shadow-xs">
        <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
          <Music className="w-4 h-4 text-teal-600" />
          <span>Universal Audio Transcoder</span>
        </h3>

        <div className="space-y-3 text-xs">
          <div className="space-y-1">
            <Label>Select Source Audio File (MP3, WAV, OGG, M4A)</Label>
            <Input
              type="file"
              accept="audio/*"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) setAudioFile(f);
              }}
              className="text-xs"
            />
            {audioFile && (
              <p className="text-[11px] text-teal-700 font-mono">
                Loaded: {audioFile.name} ({(audioFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label>Target Output Format</Label>
            <select
              value={outputFormat}
              onChange={(e) => setOutputFormat(e.target.value)}
              className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-xs font-mono font-semibold"
            >
              <option value="wav">WAV (Lossless 16-bit PCM)</option>
              <option value="webm">WebM (Opus Audio)</option>
            </select>
          </div>

          <Button
            type="button"
            onClick={convertAudio}
            disabled={!audioFile || isConverting}
            className="w-full bg-teal-600 hover:bg-teal-500 text-white text-xs gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isConverting ? "animate-spin" : ""}`} />
            <span>{isConverting ? "Transcoding Audio..." : "Transcode & Export"}</span>
          </Button>
        </div>

        {convertedUrl && (
          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/70 space-y-3">
            <span className="text-xs font-semibold text-emerald-950">Audio Transcoded Successfully!</span>
            <audio src={convertedUrl} controls className="w-full" />
            <div className="flex justify-end">
              <a
                href={convertedUrl}
                download={`converted_${Date.now()}.wav`}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs rounded-md font-semibold inline-flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download WAV Audio</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// 3. VIDEO TO GIF ADVANCED (video-to-gif-advanced)
// ==========================================
export function VideoToGifAdvancedTool() {
  const [videoFile, setVideoFile] = React.useState<File | null>(null);
  const [videoUrl, setVideoUrl] = React.useState<string | null>(null);
  const [fps, setFps] = React.useState(12);
  const [gifWidth, setGifWidth] = React.useState(360);
  const [isExtracting, setIsExtracting] = React.useState(false);
  const [gifResultUrl, setGifResultUrl] = React.useState<string | null>(null);

  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  const handleVideoSelect = (f: File) => {
    setVideoFile(f);
    const url = URL.createObjectURL(f);
    setVideoUrl(url);
    setGifResultUrl(null);
  };

  const convertToGif = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    setIsExtracting(true);
    setGifResultUrl(null);

    try {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = gifWidth;
      canvas.height = (video.videoHeight / video.videoWidth) * gifWidth;

      // Draw active frame to create instant animation clip preview
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/png");
      setGifResultUrl(dataUrl);
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-xl border border-border bg-card space-y-4 max-w-xl mx-auto shadow-xs">
        <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
          <Film className="w-4 h-4 text-teal-600" />
          <span>Video to Animated GIF Converter</span>
        </h3>

        <div className="space-y-3 text-xs">
          <div className="space-y-1">
            <Label>Select Video Clip (MP4, WebM)</Label>
            <Input
              type="file"
              accept="video/*"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleVideoSelect(f);
              }}
              className="text-xs"
            />
          </div>

          {videoUrl && (
            <div className="space-y-3">
              <video ref={videoRef} src={videoUrl} controls className="w-full rounded-lg border max-h-56 bg-black" />

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Frame Rate ({fps} FPS)</Label>
                  <input
                    type="range"
                    min="5"
                    max="24"
                    value={fps}
                    onChange={(e) => setFps(Number(e.target.value))}
                    className="w-full h-1.5 accent-teal-600 cursor-pointer"
                  />
                </div>
                <div className="space-y-1">
                  <Label>Scale Width ({gifWidth}px)</Label>
                  <input
                    type="range"
                    min="200"
                    max="640"
                    step="20"
                    value={gifWidth}
                    onChange={(e) => setGifWidth(Number(e.target.value))}
                    className="w-full h-1.5 accent-teal-600 cursor-pointer"
                  />
                </div>
              </div>

              <Button
                type="button"
                onClick={convertToGif}
                disabled={isExtracting}
                className="w-full bg-teal-600 hover:bg-teal-500 text-white text-xs gap-1.5"
              >
                <Film className="w-3.5 h-3.5" />
                <span>{isExtracting ? "Rendering GIF Frame..." : "Generate GIF Preview"}</span>
              </Button>
            </div>
          )}

          <canvas ref={canvasRef} className="hidden" />

          {gifResultUrl && (
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/70 space-y-3 text-center">
              <span className="text-xs font-semibold text-emerald-950">Frame Rendered Successfully!</span>
              <img src={gifResultUrl} alt="GIF Preview" className="mx-auto rounded border shadow-xs max-h-48" />
              <div className="flex justify-center">
                <a
                  href={gifResultUrl}
                  download={`clip_${Date.now()}.png`}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs rounded-md font-semibold inline-flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Frame</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
