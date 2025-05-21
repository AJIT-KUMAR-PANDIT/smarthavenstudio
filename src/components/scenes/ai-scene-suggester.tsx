"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Wand2, Loader2, Lightbulb, ThumbsUp, ThumbsDown, PlusCircle } from "lucide-react";
import { suggestSceneConfigurations } from "@/ai/flows/suggest-scene-configurations";
import type { SuggestSceneConfigurationsOutput, SuggestSceneConfigurationsInput } from "@/ai/flows/suggest-scene-configurations";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function AiSceneSuggester() {
  const [userHabits, setUserHabits] = useState("I usually watch movies in the evening around 8 PM. I like the lights dim and a comfortable temperature.");
  const [deviceCapabilities, setDeviceCapabilities] = useState("I have smart RGB lights in the living room, a smart thermostat, and smart blinds.");
  const [environmentalData, setEnvironmentalData] = useState("It's currently evening, clear sky, 20°C outside.");
  const [suggestions, setSuggestions] = useState<SuggestSceneConfigurationsOutput['suggestedScenes'] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    setIsLoading(true);
    setSuggestions(null);
    try {
      const input: SuggestSceneConfigurationsInput = {
        userHabits,
        deviceCapabilities,
        environmentalData,
      };
      const result = await suggestSceneConfigurations(input);
      setSuggestions(result.suggestedScenes);
      toast({
        title: "Suggestions Generated",
        description: `${result.suggestedScenes.length} new scene ideas for you!`,
      });
    } catch (error) {
      console.error("Error fetching scene suggestions:", error);
      toast({
        title: "Error",
        description: "Could not fetch scene suggestions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateScene = (sceneName: string) => {
     toast({
        title: `Creating scene: ${sceneName}`,
        description: "This would take you to the scene creation flow.",
      });
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="h-6 w-6 text-primary" />
          AI Scene Suggestions
        </CardTitle>
        <CardDescription>
          Describe your habits, available devices, and current environment to get personalized scene suggestions.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label htmlFor="userHabits" className="block text-sm font-medium text-foreground mb-1">Your Habits & Preferences</label>
          <Textarea
            id="userHabits"
            value={userHabits}
            onChange={(e) => setUserHabits(e.target.value)}
            placeholder="e.g., I wake up at 7 AM, prefer soft lighting..."
            className="min-h-[80px] bg-card"
          />
        </div>
        <div>
          <label htmlFor="deviceCapabilities" className="block text-sm font-medium text-foreground mb-1">Your Smart Devices</label>
          <Textarea
            id="deviceCapabilities"
            value={deviceCapabilities}
            onChange={(e) => setDeviceCapabilities(e.target.value)}
            placeholder="e.g., Philips Hue lights, Nest thermostat, smart plugs..."
            className="min-h-[80px] bg-card"
          />
        </div>
        <div>
          <label htmlFor="environmentalData" className="block text-sm font-medium text-foreground mb-1">Current Environment (Optional)</label>
          <Textarea
            id="environmentalData"
            value={environmentalData}
            onChange={(e) => setEnvironmentalData(e.target.value)}
            placeholder="e.g., Rainy day, evening, summer..."
            className="min-h-[60px] bg-card"
          />
        </div>
        <Button onClick={handleSubmit} disabled={isLoading} className="w-full">
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Wand2 className="mr-2 h-4 w-4" />
          )}
          Get Suggestions
        </Button>
      </CardContent>

      {suggestions && suggestions.length > 0 && (
        <CardFooter className="flex flex-col gap-4 items-start">
          <h3 className="text-lg font-semibold text-foreground">Suggested Scenes:</h3>
          {suggestions.map((scene, index) => (
            <Card key={index} className="w-full bg-background/50 p-4 shadow-md">
              <CardTitle className="text-md flex items-center justify-between">
                {scene.sceneName}
                <Button size="sm" variant="default" onClick={() => handleCreateScene(scene.sceneName)}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Create
                </Button>
              </CardTitle>
              <CardDescription className="mt-1 text-xs">{scene.sceneDescription}</CardDescription>
              <div className="mt-3 space-y-2">
                <p className="text-xs"><strong className="text-foreground">Actions:</strong> {scene.deviceActions.map(a => `${a.deviceName}: ${a.action}(${JSON.stringify(a.parameters)})`).join(', ')}</p>
                <p className="text-xs"><strong className="text-foreground">Benefits:</strong> {scene.userBenefits}</p>
                <p className="text-xs"><strong className="text-foreground">Energy Tips:</strong> {scene.energyEfficiencyTips}</p>
              </div>
              <div className="mt-3 flex gap-2">
                <Button variant="outline" size="icon" className="h-7 w-7"><ThumbsUp className="h-4 w-4" /></Button>
                <Button variant="outline" size="icon" className="h-7 w-7"><ThumbsDown className="h-4 w-4" /></Button>
              </div>
            </Card>
          ))}
        </CardFooter>
      )}
      {suggestions === null && !isLoading && (
         <CardFooter>
            <Alert>
                <Lightbulb className="h-4 w-4" />
                <AlertTitle>Ready for Ideas?</AlertTitle>
                <AlertDescription>
                    Fill in your preferences above and let our AI craft smart scenes tailored for you.
                </AlertDescription>
            </Alert>
         </CardFooter>
      )}
       {suggestions?.length === 0 && !isLoading && (
         <CardFooter>
            <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>No Suggestions Found</AlertTitle>
                <AlertDescription>
                    We couldn&apos;t generate any suggestions based on the provided input. Try being more specific or check your device list.
                </AlertDescription>
            </Alert>
         </CardFooter>
      )}
    </Card>
  );
}
