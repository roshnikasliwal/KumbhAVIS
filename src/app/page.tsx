import { Header } from "@/components/dashboard/header";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { MapView } from "@/components/dashboard/map-view";
import { VideoFeed } from "@/components/dashboard/video-feed";
import { AlertsPanel } from "@/components/dashboard/alerts-panel";
import { LogsPanel } from "@/components/dashboard/logs-panel";
import { Users, AlertTriangle, ShieldCheck, MapPin } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1 space-y-6 p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard title="Crowd Density" value="High" icon={<Users className="text-primary" />} />
          <KpiCard title="Active Alerts" value="3" icon={<AlertTriangle className="text-destructive" />} />
          <KpiCard title="Personnel Deployed" value="47" icon={<ShieldCheck className="text-primary" />} />
          <KpiCard title="Monitored Zones" value="12" icon={<MapPin className="text-primary" />} />
        </div>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
          <div className="grid auto-rows-max items-start gap-6 lg:col-span-2">
            <MapView />
            <div className="grid gap-6 md:grid-cols-2">
              <VideoFeed 
                feedName="Ghat 1" 
                crowdDensity="High" 
                videoSrc="https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4" 
              />
              <VideoFeed 
                feedName="Main Street" 
                initialAnomalyDetected={true} 
                crowdDensity="Critical" 
                videoSrc="https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
              />
            </div>
          </div>
          <div className="grid auto-rows-max items-start gap-6 lg:col-span-1">
            <AlertsPanel />
            <LogsPanel />
          </div>
        </div>
      </main>
    </div>
  );
}
