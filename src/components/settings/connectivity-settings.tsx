
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ServerIcon, LockIcon, Settings2, Save } from 'lucide-react';

const mqttSettingsSchema = z.object({
  enabled: z.boolean().default(false),
  brokerUrl: z.string().url({ message: 'Please enter a valid URL (e.g., mqtt://localhost:1883)' }).optional().or(z.literal('')),
  port: z.coerce.number().min(1).max(65535).optional().or(z.literal('')),
  username: z.string().optional(),
  password: z.string().optional(),
  clientId: z.string().optional().or(z.literal('')),
  useTls: z.boolean().default(false),
  topicPrefix: z.string().optional().default('smarthaven/'),
});

type MqttSettingsValues = z.infer<typeof mqttSettingsSchema>;

const httpSettingsSchema = z.object({
  defaultTimeout: z.coerce.number().min(100).max(60000).default(5000), // ms
  preferHttps: z.boolean().default(true),
});

type HttpSettingsValues = z.infer<typeof httpSettingsSchema>;

export function ConnectivitySettings() {
  const { toast } = useToast();

  const mqttForm = useForm<MqttSettingsValues>({
    resolver: zodResolver(mqttSettingsSchema),
    defaultValues: {
      enabled: false,
      brokerUrl: '',
      port: 1883,
      username: '',
      password: '',
      clientId: `smarthaven-client-${Math.random().toString(36).substring(7)}`,
      useTls: false,
      topicPrefix: 'smarthaven/',
    },
    // In a real app, load initial values from user preferences or backend
  });

  const httpForm = useForm<HttpSettingsValues>({
    resolver: zodResolver(httpSettingsSchema),
    defaultValues: {
      defaultTimeout: 5000,
      preferHttps: true,
    },
    // In a real app, load initial values
  });

  function onSubmitMqtt(data: MqttSettingsValues) {
    console.log('MQTT Settings:', data);
    toast({
      title: 'MQTT Settings Saved',
      description: 'Your MQTT configuration has been updated (mocked).',
    });
  }

  function onSubmitHttp(data: HttpSettingsValues) {
    console.log('HTTP/S Settings:', data);
    toast({
      title: 'HTTP/S Settings Saved',
      description: 'Your HTTP/HTTPS configuration has been updated (mocked).',
    });
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><ServerIcon className="h-5 w-5 text-primary"/>MQTT Broker Configuration</CardTitle>
          <CardDescription>Setup connection to your MQTT broker for real-time device communication.</CardDescription>
        </CardHeader>
        <Form {...mqttForm}>
          <form onSubmit={mqttForm.handleSubmit(onSubmitMqtt)}>
            <CardContent className="space-y-4">
              <FormField
                control={mqttForm.control}
                name="enabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Enable MQTT</FormLabel>
                      <FormDescription>
                        Connect to an MQTT broker for device control.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              {mqttForm.watch('enabled') && (
                <>
                  <FormField
                    control={mqttForm.control}
                    name="brokerUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Broker URL</FormLabel>
                        <FormControl>
                          <Input placeholder="mqtt://your-broker.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={mqttForm.control}
                    name="port"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Port</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="1883" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={mqttForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="mqtt_user" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={mqttForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password (Optional)</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={mqttForm.control}
                    name="clientId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Client ID</FormLabel>
                        <FormControl>
                          <Input placeholder="smarthaven-unique-id" {...field} />
                        </FormControl>
                        <FormDescription>A unique ID for this SmartHaven instance.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={mqttForm.control}
                    name="useTls"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Use TLS/SSL</FormLabel>
                          <FormDescription>
                            Enable secure connection to the MQTT broker.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={mqttForm.control}
                    name="topicPrefix"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Topic Prefix</FormLabel>
                        <FormControl>
                          <Input placeholder="smarthaven/" {...field} />
                        </FormControl>
                        <FormDescription>Root topic for SmartHaven messages.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={!mqttForm.watch('enabled') && !mqttForm.formState.isDirty}>
                <Save className="mr-2 h-4 w-4" /> Save MQTT Settings
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Settings2 className="h-5 w-5 text-primary"/>HTTP/HTTPS Device Settings</CardTitle>
          <CardDescription>Configure default behavior for HTTP/HTTPS based devices.</CardDescription>
        </CardHeader>
        <Form {...httpForm}>
          <form onSubmit={httpForm.handleSubmit(onSubmitHttp)}>
            <CardContent className="space-y-4">
              <FormField
                control={httpForm.control}
                name="defaultTimeout"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default Request Timeout (ms)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="5000" {...field} />
                    </FormControl>
                    <FormDescription>Timeout for requests to HTTP/HTTPS devices in milliseconds.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={httpForm.control}
                name="preferHttps"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Prefer HTTPS for Device Communication</FormLabel>
                      <FormDescription>
                        Attempt HTTPS connections first when communicating with devices.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" /> Save HTTP/S Settings
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
