// Sign Language Recognition Module (TypeScript)

export type GestureCallback = (gesture: string, buffer: string) => void;

export interface SignLanguageServerMessage {
	type: string;
	character?: string;
	confidence?: number;
	action?: string;
}

export class SignLanguageRecognition {
	public isActive: boolean;
	private camera: MediaStream | null;
	private canvas: HTMLCanvasElement | null;
	private ctx: CanvasRenderingContext2D | null;
	private recognitionInterval: number | null;
	private gestureBuffer: string;
	private lastGesture: string;
	private gestureCooldown: number;
	private callbacks: GestureCallback[];
	private socket: WebSocket | null;
	private serverAvailable: boolean;
	private videoElement: HTMLVideoElement | null;

	constructor() {
		this.isActive = false;
		this.camera = null;
		this.canvas = null;
		this.ctx = null;
		this.recognitionInterval = null;
		this.gestureBuffer = '';
		this.lastGesture = '';
		this.gestureCooldown = 0;
		this.callbacks = [];
		this.socket = null;
		this.serverAvailable = false;
		this.videoElement = null;
	}

	public setVideoElement(video: HTMLVideoElement | null) {
		this.videoElement = video;
	}

	public async initCamera(): Promise<boolean> {
		try {
			await this.initServerConnection();
			if (this.serverAvailable) {
				return true;
			}

			const stream = await navigator.mediaDevices.getUserMedia({
				video: {
					width: { ideal: 640 },
					height: { ideal: 480 },
					facingMode: 'user'
				}
			});

			this.camera = stream;

			if (this.videoElement) {
				this.videoElement.srcObject = stream;
				this.videoElement.play().catch(() => {});
			}

			this.canvas = document.createElement('canvas');
			this.ctx = this.canvas.getContext('2d');
			this.canvas.width = 640;
			this.canvas.height = 480;

			return true;
		} catch (error) {
			console.error('Camera initialization failed:', error);
			return false;
		}
	}

	private async initServerConnection(): Promise<boolean> {
		try {
			const response = await fetch('http://localhost:5001/api/start_detection', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' }
			});
			if (response.ok) {
				this.serverAvailable = true;
				this.initWebSocket();
				return true;
			}
			this.serverAvailable = false;
			return false;
		} catch (error) {
			this.serverAvailable = false;
			return false;
		}
	}

	private initWebSocket() {
		try {
			this.socket = new WebSocket('ws://localhost:5001');
			this.socket.onmessage = (event: MessageEvent<string>) => {
				try {
					const data = JSON.parse(event.data) as SignLanguageServerMessage;
					this.handleServerData(data);
				} catch (e) {
					console.error('Error parsing server data:', e);
				}
			};
			this.socket.onclose = () => {
				this.socket = null;
			};
		} catch (error) {
			console.error('Failed to initialize WebSocket:', error);
		}
	}

	private handleServerData(data: SignLanguageServerMessage) {
		if (data.type === 'sign_detected' && data.character) {
			const currentTime = Date.now();
			if (currentTime - this.gestureCooldown > 1500) {
				this.gestureBuffer += data.character;
				this.processServerGesture(data.character, data.confidence, data.action);
				this.gestureCooldown = currentTime;
			}
		}
	}

	private processServerGesture(character?: string, _confidence?: number, _action?: string) {
		if (!character) return;
		const commandMap: Record<string, string> = {
			'A': 'help',
			'B': 'music',
			'C': 'camera',
			'D': 'legal',
			'E': 'schemes',
			'F': 'assistant',
			'G': 'tasks',
			'H': 'clear',
			'I': 'stop',
			'J': 'start',
			'K': 'yes',
			'L': 'no',
			'M': 'more',
			'N': 'next',
			'O': 'ok',
			'P': 'play',
			'Q': 'quit',
			'R': 'repeat',
			'S': 'space',
			'T': 'time',
			'U': 'up',
			'V': 'down',
			'W': 'wait',
			'X': 'exit',
			'Y': 'yes',
			'Z': 'zero'
		};
		const command = commandMap[character] || character.toLowerCase();
		this.executeCommand(command);
	}

	public startRecognition() {
		if (this.isActive) return;
		this.isActive = true;
		this.gestureBuffer = '';
		this.lastGesture = '';
		this.gestureCooldown = 0;
		if (this.serverAvailable) {
			return;
		}
		this.recognitionInterval = window.setInterval(() => this.processFrame(), 100);
	}

	public stopRecognition() {
		if (!this.isActive) return;
		this.isActive = false;
		if (this.serverAvailable) {
			fetch('http://localhost:5001/api/stop_detection', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' }
			}).catch(() => {});
		} else if (this.recognitionInterval) {
			clearInterval(this.recognitionInterval);
			this.recognitionInterval = null;
		}
	}

	private processFrame() {
		if (!this.isActive || !this.camera || !this.ctx || !this.canvas) return;
		const video = this.videoElement;
		if (!video || !video.videoWidth) return;
		try {
			this.ctx.drawImage(video, 0, 0, this.canvas.width, this.canvas.height);
			const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
			const gesture = this.detectHandGesture(imageData);
			if (gesture && gesture !== this.lastGesture && this.gestureCooldown <= 0) {
				this.processGesture(gesture);
				this.lastGesture = gesture;
				this.gestureCooldown = 10;
			}
			if (this.gestureCooldown > 0) this.gestureCooldown--;
		} catch (error) {
			console.error('Frame processing error:', error);
		}
	}

	private detectHandGesture(imageData: ImageData): string | null {
		const { data, width, height } = imageData;
		const handRegions = this.detectHandRegions(data, width, height);
		if (handRegions.length === 0) return null;
		return this.analyzeHandShape(handRegions[0]);
	}

	private detectHandRegions(data: Uint8ClampedArray, width: number, height: number) {
		const regions: any[] = [];
		const visited = new Array(width * height).fill(false);
		for (let y = 0; y < height; y += 5) {
			for (let x = 0; x < width; x += 5) {
				const index = y * width + x;
				if (visited[index]) continue;
				const pixelIndex = index * 4;
				const r = data[pixelIndex];
				const g = data[pixelIndex + 1];
				const b = data[pixelIndex + 2];
				if (this.isSkinColor(r, g, b)) {
					const region = this.floodFill(data, width, height, x, y, visited, r, g, b);
					if (region.area > 1000) regions.push(region);
				}
			}
		}
		return regions;
	}

	private isSkinColor(r: number, g: number, b: number) {
		const skinR = r > 95 && r < 255;
		const skinG = g > 40 && g < 255;
		const skinB = b > 20 && b < 255;
		const skinDiff = Math.abs(r - g) > 15;
		const skinRatio = g > 0 ? r / g > 1.185 : false;
		return skinR && skinG && skinB && skinDiff && skinRatio;
	}

	private floodFill(
		data: Uint8ClampedArray,
		width: number,
		height: number,
		startX: number,
		startY: number,
		visited: boolean[],
		targetR: number,
		targetG: number,
		targetB: number
	) {
		const stack: Array<{ x: number; y: number }> = [{ x: startX, y: startY }];
		const region = {
			area: 0,
			minX: startX,
			maxX: startX,
			minY: startY,
			maxY: startY,
			centerX: startX,
			centerY: startY
		};
		while (stack.length > 0) {
			const { x, y } = stack.pop() as { x: number; y: number };
			if (x < 0 || x >= width || y < 0 || y >= height) continue;
			const index = y * width + x;
			if (visited[index]) continue;
			const pixelIndex = index * 4;
			const r = data[pixelIndex];
			const g = data[pixelIndex + 1];
			const b = data[pixelIndex + 2];
			const colorDiff = Math.abs(r - targetR) + Math.abs(g - targetG) + Math.abs(b - targetB);
			if (colorDiff > 30) continue;
			visited[index] = true;
			region.area++;
			region.minX = Math.min(region.minX, x);
			region.maxX = Math.max(region.maxX, x);
			region.minY = Math.min(region.minY, y);
			region.maxY = Math.max(region.maxY, y);
			stack.push({ x: x + 1, y }, { x: x - 1, y }, { x, y: y + 1 }, { x, y: y - 1 });
		}
		region.centerX = (region.minX + region.maxX) / 2;
		region.centerY = (region.minY + region.maxY) / 2;
		return region;
	}

	private analyzeHandShape(handRegion: any): string {
		const { centerX, centerY, minX, maxX, minY, maxY } = handRegion;
		const width = maxX - minX;
		const height = maxY - minY;
		const aspectRatio = height ? width / height : 1;
		if (centerY < 200) return 'A';
		if (centerY > 300) return 'B';
		if (centerX < 200) return 'C';
		if (centerX > 400) return 'D';
		if (aspectRatio > 1.2) return 'E';
		if (aspectRatio < 0.8) return 'F';
		return 'G';
	}

	private processGesture(gesture: string) {
		this.gestureBuffer += gesture;
		if (this.gestureBuffer.length >= 3) {
			const word = this.gestureBuffer.slice(-3);
			this.processGestureWord(word);
		}
		this.callbacks.forEach((cb) => cb(gesture, this.gestureBuffer));
	}

	private processGestureWord(word: string) {
		const commands: Record<string, string> = {
			ABC: 'help',
			DEF: 'music',
			GHI: 'reminder',
			JKL: 'camera',
			MNO: 'legal',
			PQR: 'schemes',
			STU: 'assistant',
			VWX: 'stop',
			YZ: 'clear'
		};
		if ((commands as any)[word]) {
			this.executeCommand((commands as any)[word]);
			this.gestureBuffer = '';
		}
	}

	private dispatchCommand(command: string) {
		try {
			const event = new CustomEvent('signLanguageCommand', { detail: { command } });
			document.dispatchEvent(event);
		} catch {}
	}

	private executeCommand(command: string) {
		this.dispatchCommand(command);
	}

	public onGesture(callback: GestureCallback) {
		this.callbacks.push(callback);
	}

	public removeCallback(callback: GestureCallback) {
		const index = this.callbacks.indexOf(callback);
		if (index > -1) this.callbacks.splice(index, 1);
	}

	public getGestureBuffer() {
		return this.gestureBuffer;
	}

	public clearBuffer() {
		this.gestureBuffer = '';
		if (this.serverAvailable) {
			fetch('http://localhost:5001/api/clear_buffer', { method: 'POST', headers: { 'Content-Type': 'application/json' } }).catch(() => {});
		}
	}

	public destroy() {
		this.stopRecognition();
		if (this.camera) {
			this.camera.getTracks().forEach((t) => t.stop());
			this.camera = null;
		}
		if (this.socket) {
			this.socket.close();
			this.socket = null;
		}
		this.callbacks = [];
	}
}

export const signLanguageRecognition = new SignLanguageRecognition();
