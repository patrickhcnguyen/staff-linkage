import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin, Calendar, Clock, DollarSign, Camera } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const MAPBOX_TOKEN = 'YOUR_MAPBOX_PUBLIC_TOKEN';

interface JobDetails {
  title: string;
  location: string;
  coordinates: [number, number]; // [longitude, latitude]
  date: string;
  startTime: string;
  endTime: string;
  hourlyRate: number;
  description: string;
}

interface ClockInData {
  time: Date;
  selfieImage: string;
  location: {
    latitude: number;
    longitude: number;
  };
}

const JobDetails = () => {
  const { id } = useParams();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const clockInMarker = useRef<mapboxgl.Marker | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [clockedIn, setClockedIn] = useState(false);
  const [clockedOut, setClockedOut] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [clockInTime, setClockInTime] = useState<Date | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [selfieImage, setSelfieImage] = useState<string | null>(null);
  const [clockInData, setClockInData] = useState<ClockInData | null>(null);

  const job: JobDetails = {
    title: "Corporate Gala Event",
    location: "Grand Plaza Hotel",
    coordinates: [-74.006, 40.7128], // Example coordinates for New York City
    date: "March 15, 2024",
    startTime: "14:00",
    endTime: "22:00",
    hourlyRate: 25,
    description: "High-end corporate gala requiring professional event staff.",
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: job.coordinates,
      zoom: 15
    });

    new mapboxgl.Marker({ color: "#0ea5e9" })
      .setLngLat(job.coordinates)
      .setPopup(new mapboxgl.Popup().setHTML(`<h3>${job.title}</h3><p>${job.location}</p>`))
      .addTo(map.current);

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    if (clockInData) {
      clockInMarker.current = new mapboxgl.Marker({ color: "#22c55e" })
        .setLngLat([clockInData.location.longitude, clockInData.location.latitude])
        .setPopup(new mapboxgl.Popup().setHTML(`
          <div>
            <h3>Clock-in Location</h3>
            <p>${new Date(clockInData.time).toLocaleTimeString()}</p>
          </div>
        `))
        .addTo(map.current);

      const bounds = new mapboxgl.LngLatBounds()
        .extend(job.coordinates)
        .extend([clockInData.location.longitude, clockInData.location.latitude]);

      map.current.fitBounds(bounds, {
        padding: 50
      });
    }

    return () => {
      map.current?.remove();
    };
  }, [clockInData]);

  useEffect(() => {
    let timerInterval: NodeJS.Timeout;

    if (clockedIn && !clockedOut && clockInTime) {
      timerInterval = setInterval(() => {
        const now = new Date();
        const elapsed = Math.floor((now.getTime() - clockInTime.getTime()) / 1000);
        setElapsedTime(elapsed);
      }, 1000);
    }

    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [clockedIn, clockedOut, clockInTime]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraOpen(true);
      }
    } catch (err) {
      toast.error("Unable to access camera");
      console.error("Error accessing camera:", err);
    }
  };

  const getCurrentLocation = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by your browser"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position),
        (error) => reject(error),
        { enableHighAccuracy: true }
      );
    });
  };

  const takeSelfie = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    try {
      const position = await getCurrentLocation();
      
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const imageData = canvasRef.current.toDataURL('image/jpeg');
        
        const clockInInfo: ClockInData = {
          time: new Date(),
          selfieImage: imageData,
          location: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }
        };
        
        setClockInData(clockInInfo);
        setSelfieImage(imageData);
        stopCamera();
        proceedWithClockIn();
      }
    } catch (err) {
      toast.error("Unable to get your location. Please enable location services and try again.");
      console.error("Error getting location:", err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraOpen(false);
  };

  const isWithinClockInWindow = () => {
    const now = currentTime;
    const [hours, minutes] = job.startTime.split(':').map(Number);
    const jobStartTime = new Date(now);
    jobStartTime.setHours(hours, minutes, 0);
    
    const clockInWindow = new Date(jobStartTime);
    clockInWindow.setMinutes(clockInWindow.getMinutes() - 15);
    
    return now >= clockInWindow && now <= jobStartTime;
  };

  const isWithinClockOutWindow = () => {
    const now = currentTime;
    const [hours, minutes] = job.endTime.split(':').map(Number);
    const jobEndTime = new Date(now);
    jobEndTime.setHours(hours, minutes, 0);
    
    const clockOutWindowStart = new Date(jobEndTime);
    clockOutWindowStart.setMinutes(clockOutWindowStart.getMinutes() - 15);
    const clockOutWindowEnd = new Date(jobEndTime);
    clockOutWindowEnd.setMinutes(clockOutWindowEnd.getMinutes() + 15);
    
    return now >= clockOutWindowStart && now <= clockOutWindowEnd;
  };

  const handleClockIn = async () => {
    if (!isWithinClockInWindow()) {
      toast.error("You can only clock in 15 minutes before the start time.");
      return;
    }

    try {
      await getCurrentLocation();
      startCamera();
    } catch (err) {
      toast.error("Please enable location services to clock in");
      console.error("Error accessing location:", err);
    }
  };

  const proceedWithClockIn = () => {
    setClockInTime(new Date());
    setClockedIn(true);
    setElapsedTime(0);
    toast.success("Successfully clocked in!");
  };

  const handleClockOut = () => {
    if (!isWithinClockOutWindow()) {
      toast.error("You can only clock out within 15 minutes of the end time.");
      return;
    }
    setClockedOut(true);
    toast.success("Successfully clocked out!");
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const time = new Date();
    time.setHours(parseInt(hours), parseInt(minutes));
    return time.toLocaleTimeString('en-US', { 
      hour: 'numeric',
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatElapsedTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{job.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {job.location}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {job.date}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                {formatTime(job.startTime)} - {formatTime(job.endTime)}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                ${job.hourlyRate}/hr
              </div>
              {clockedIn && !clockedOut && (
                <div className="mt-4 text-xl font-mono font-semibold">
                  Elapsed Time: {formatElapsedTime(elapsedTime)}
                </div>
              )}
              {selfieImage && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Clock-in Selfie:</h4>
                  <img 
                    src={selfieImage} 
                    alt="Clock-in selfie" 
                    className="w-48 h-48 object-cover rounded-lg border"
                  />
                </div>
              )}
            </div>
            <div className="flex flex-col gap-4">
              <Button
                className="w-full"
                disabled={clockedIn || !isWithinClockInWindow()}
                onClick={handleClockIn}
              >
                <Camera className="mr-2 h-4 w-4" />
                Clock In
              </Button>
              <Button
                className="w-full"
                disabled={!clockedIn || clockedOut || !isWithinClockOutWindow()}
                onClick={handleClockOut}
              >
                Clock Out
              </Button>
            </div>
          </div>
          <p className="mt-4 text-muted-foreground">{job.description}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Location</CardTitle>
        </CardHeader>
        <CardContent>
          <div ref={mapContainer} className="h-[400px] w-full rounded-lg" />
        </CardContent>
      </Card>

      <Dialog open={isCameraOpen} onOpenChange={(open) => {
        if (!open) stopCamera();
        setIsCameraOpen(open);
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Take a Selfie to Clock In</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full rounded-lg"
            />
            <Button onClick={takeSelfie}>
              <Camera className="mr-2 h-4 w-4" />
              Take Selfie
            </Button>
            <canvas ref={canvasRef} className="hidden" />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JobDetails;
