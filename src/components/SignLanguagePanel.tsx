"use client";

import { useEffect, useRef, useState } from 'react';
import { signLanguageRecognition } from "../lib/signLanguage";
import { Camera, StopCircle, Hand, Globe } from "lucide-react";

interface SignLanguagePanelProps {
	onClose?: () => void;
	onGestureText?: (text: string) => void;
	className?: string;
}

export default function SignLanguagePanel({ onClose, onGestureText, className }: SignLanguagePanelProps) {
	const videoRef = useRef<HTMLVideoElement>(null);
	const [isActive, setIsActive] = useState(false);
	const [buffer, setBuffer] = useState("");
	const [initializing, setInitializing] = useState(false);
	const [useServerView, setUseServerView] = useState(false);

	useEffect(() => {
		const cb = (_gesture: string, gBuffer: string) => {
			setBuffer(gBuffer);
			if (onGestureText) {
				onGestureText(gBuffer);
			}
		};
		signLanguageRecognition.onGesture(cb);
		return () => {
			signLanguageRecognition.removeCallback(cb);
		};
	}, [onGestureText]);

	const start = async () => {
		if (initializing || isActive) return;
		setInitializing(true);
		if (videoRef.current) signLanguageRecognition.setVideoElement(videoRef.current);
		const ok = await signLanguageRecognition.initCamera();
		if (ok) {
			signLanguageRecognition.startRecognition();
			setIsActive(true);
			setUseServerView(signLanguageRecognition.isServerAvailable);
		}
		setInitializing(false);
	};

	const stop = () => {
		signLanguageRecognition.stopRecognition();
		setIsActive(false);
	};

	useEffect(() => {
		return () => {
			stop();
		};
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className={`bg-white rounded-2xl shadow-2xl border border-gray-200 w-[360px] h-[600px] p-3 flex flex-col ${className || ''}`}>
			<div className="flex items-center justify-between mb-2">
				<div className="flex items-center gap-2">
					<div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center">
						<Hand className="w-4 h-4" />
					</div>
					<div className="text-sm font-semibold text-gray-900">Sign Language</div>
				</div>
				<div className="flex items-center gap-2">
					{signLanguageRecognition.isServerAvailable && (
						<button onClick={() => setUseServerView(v => !v)} title="Toggle server view" className={`px-2 py-1.5 rounded-lg text-xs border ${useServerView ? 'bg-blue-50 border-blue-400 text-blue-700' : 'bg-gray-50 border-gray-300 text-gray-700'}`}>
							<Globe className="w-4 h-4" />
						</button>
					)}
					<button onClick={isActive ? stop : start} className={`px-3 py-1.5 rounded-lg text-white text-sm shadow ${isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}`}>
						{isActive ? (
							<span className="inline-flex items-center gap-1"><StopCircle className="w-4 h-4" /> Stop</span>
						) : (
							<span className="inline-flex items-center gap-1"><Camera className="w-4 h-4" /> Start</span>
						)}
					</button>
					{onClose && (
						<button onClick={onClose} className="px-3 py-1.5 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 text-sm">Close</button>
					)}
				</div>
			</div>
			<div className="relative rounded-xl overflow-hidden border border-gray-200 bg-black aspect-video w-full h-[260px]">
				{useServerView && signLanguageRecognition.isServerAvailable ? (
					/* Show MJPEG stream from server with drawn landmarks */
					<img src="http://localhost:5001/video_feed" alt="Sign server stream" className="w-full h-full object-cover" />
				) : (
					<video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
				)}
				{initializing && (
					<div className="absolute inset-0 bg-black/50 text-white text-sm flex items-center justify-center">Initializing camera…</div>
				)}
			</div>
			<div className="mt-3">
				<div className="text-xs text-gray-600 mb-1">Detected buffer</div>
				<div className="font-mono text-sm p-2 rounded-lg bg-gray-50 border border-gray-200 h-16 overflow-auto">{buffer}</div>
			</div>
			<div className="mt-auto pt-3 grid grid-cols-2 gap-2 text-sm">
				<button onClick={() => { signLanguageRecognition.clearBuffer(); setBuffer(""); }} className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800">Clear</button>
				<button onClick={() => { if (onGestureText) onGestureText(buffer); }} className="px-3 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white">Send to chat</button>
			</div>
		</div>
	);
}
