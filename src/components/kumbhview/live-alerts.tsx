
'use client'

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Megaphone, Users, Siren, Bell, Loader2, HeartPulse, Send, AlertCircle, PlusCircle, ShieldAlert } from "lucide-react";
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { dispatchResponder } from '@/ai/flows/dispatch-responder';
import { dispatchDrone } from '@/ai/flows/dispatch-drone';
import type { Role } from '@/lib/types';
import { useRoute } from '@/lib/route-context';
import { type Alert, addAlert, getAlerts, updateAlertAction } from '@/services/alerts';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { onSnapshot, query, collection, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { formatDistanceToNow } from 'date-fns';

const alertIcons: { [key: string]: React.ReactNode } = {
    "Unrest": <Megaphone className="h-4 w-4 text-red-500" />,
    "Overcrowding": <Users className="h-4 w-4 text-red-500" />,
    "Accident": <Siren className="h-4 w-4 text-red-500" />,
    "Medical": <HeartPulse className="h-4 w-4 text-red-500" />,
    "Unusual Event": <Bell className="h-4 w-4 text-blue-500" />,
    "Obstruction": <AlertCircle className="h-4 w-4 text-amber-500" />,
    "Default": <ShieldAlert className="h-4 w-4 text-muted-foreground" />,
};

interface LiveAlertsProps {
    role: Role;
}

export function LiveAlerts({ role }: LiveAlertsProps) {
    const { toast } = useToast();
    const [loading, setLoading] = React.useState<string | null>(null);
    const [alerts, setAlerts] = React.useState<Alert[]>([]);
    const { setRoute } = useRoute();
    const isAdmin = role === 'Administrator';

    React.useEffect(() => {
        const q = query(collection(db, 'live-alerts'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const fetchedAlerts: Alert[] = [];
            querySnapshot.forEach((doc) => {
                fetchedAlerts.push({ id: doc.id, ...doc.data() } as Alert);
            });
            setAlerts(fetchedAlerts);
        });

        return () => unsubscribe();
    }, []);

    const getSeverityVariant = (severity: string) => {
        switch (severity.toLowerCase()) {
            case 'high': return 'destructive';
            case 'medium': return 'secondary';
            default: return 'outline';
        }
    };
    
    const handleResponderDispatch = async (alert: Alert) => {
        if (!isAdmin) return;
        setLoading(`responder-${alert.id}`);
        setRoute(null);
        try {
          const result = await dispatchResponder({ incidentLocation: alert.location, incidentType: alert.type });
          await updateAlertAction(alert.id, { type: 'DISPATCH_RESPONDER', details: result.dispatchConfirmation });
          toast({
            title: 'Responder Dispatched',
            description: result.dispatchConfirmation,
          });
          if (result.routePolyline) {
            setRoute({
                path: result.routePolyline,
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 4,
            });
          }
        } catch (error) {
          console.error('Error dispatching responder:', error);
          toast({
            title: 'Dispatch Failed',
            description: 'Could not dispatch the responder. Please try again.',
            variant: 'destructive',
          });
        } finally {
          setLoading(null);
        }
      };

      const handleDroneDispatch = async (alert: Alert) => {
        if (!isAdmin) return;
        setLoading(`drone-${alert.id}`);
        try {
          const result = await dispatchDrone({ incidentLocation: alert.location });
          await updateAlertAction(alert.id, { type: 'DISPATCH_DRONE', details: result.confirmationMessage });
          toast({
            title: 'Drone Dispatched',
            description: result.confirmationMessage,
          });
        } catch (error) {
          console.error('Error dispatching drone:', error);
          toast({
            title: 'Dispatch Failed',
            description: 'Could not dispatch the drone. Please try again.',
            variant: 'destructive',
          });
        } finally {
          setLoading(null);
        }
      };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2"><Bell className="size-5" /> Live Alerts</CardTitle>
                    <CardDescription>Prioritized incidents requiring attention.</CardDescription>
                </div>
                 {isAdmin && <AddAlertDialog />}
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[350px]">
                    <div className="space-y-4">
                        {alerts.length === 0 && (
                            <div className="text-center text-muted-foreground py-10">
                                <p>No active alerts.</p>
                            </div>
                        )}
                        {alerts.map((alert) => (
                            <div key={alert.id} className="flex items-start gap-4 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                                <div className="mt-1">{alertIcons[alert.type] || alertIcons['Default']}</div>
                                <div className="flex-1 space-y-2">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-semibold">{alert.type}</p>
                                            <p className="text-sm text-muted-foreground">{alert.location}</p>
                                        </div>
                                        <Badge variant={getSeverityVariant(alert.severity)}>{alert.severity}</Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        {alert.createdAt ? formatDistanceToNow(alert.createdAt.toDate(), { addSuffix: true }) : 'Just now'}
                                    </p>
                                     {alert.actions && alert.actions.length > 0 && (
                                        <div className="text-xs space-y-1 pt-1">
                                            {alert.actions.map((action, index) => (
                                                <p key={index} className="text-blue-600">
                                                    <span className="font-semibold">{action.type.replace('_', ' ')}:</span> {action.details.split('.')[0]}.
                                                </p>
                                            ))}
                                        </div>
                                    )}
                                    {alert.severity === 'High' && isAdmin && (
                                        <div className="flex flex-col sm:flex-row gap-2">
                                            <Button size="sm" className="w-full" onClick={() => handleResponderDispatch(alert)} disabled={loading !== null}>
                                                {loading === `responder-${alert.id}` ? (
                                                    <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Dispatching...
                                                    </>
                                                ) : (
                                                    <>
                                                    <HeartPulse className="mr-2 h-4 w-4" />
                                                    Responder
                                                    </>
                                                )}
                                            </Button>
                                            <Button size="sm" variant="outline" className="w-full" onClick={() => handleDroneDispatch(alert)} disabled={loading !== null}>
                                                {loading === `drone-${alert.id}` ? (
                                                    <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Dispatching...
                                                    </>
                                                ) : (
                                                    <>
                                                    <Send className="mr-2 h-4 w-4" />
                                                    Drone
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}


function AddAlertDialog() {
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const { toast } = useToast();
    const [type, setType] = React.useState('');
    const [location, setLocation] = React.useState('');
    const [severity, setSeverity] = React.useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!type || !location || !severity) {
            toast({ title: "Missing Fields", description: "Please fill out all fields.", variant: "destructive" });
            return;
        }
        setLoading(true);
        try {
            await addAlert({ type, location, severity });
            toast({ title: "Alert Created", description: `A new ${severity.toLowerCase()} alert has been created for ${location}.` });
            setType('');
            setLocation('');
            setSeverity('');
            setOpen(false);
        } catch (error) {
            console.error("Failed to create alert:", error);
            toast({ title: "Error", description: "Could not create the alert.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    }

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Alert
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Create New Alert</DialogTitle>
              <DialogDescription>
                Manually create a new alert. This will be visible to all operators.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Type
                </Label>
                <div className="col-span-3">
                    <Select onValueChange={setType} value={type}>
                        <SelectTrigger id="type">
                            <SelectValue placeholder="Select alert type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Unrest">Unrest</SelectItem>
                            <SelectItem value="Overcrowding">Overcrowding</SelectItem>
                            <SelectItem value="Accident">Accident</SelectItem>
                            <SelectItem value="Medical">Medical</SelectItem>
                            <SelectItem value="Obstruction">Obstruction</SelectItem>
                            <SelectItem value="Unusual Event">Unusual Event</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="location" className="text-right">
                  Location
                </Label>
                <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} className="col-span-3" placeholder="e.g., Ghat 5" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="severity" className="text-right">
                  Severity
                </Label>
                <div className="col-span-3">
                     <Select onValueChange={setSeverity} value={severity}>
                        <SelectTrigger id="severity">
                            <SelectValue placeholder="Select severity" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Low">Low</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="High">High</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Alert
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    )
  }
