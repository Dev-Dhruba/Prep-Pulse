"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

export default function CustomizePage() {
  const [difficulty, setDifficulty] = useState(50)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center cosmic-gradient-text">Customize Your Interview</h1>

      <Tabs defaultValue="general" className="w-full max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-3 bg-cosmic-dark border border-cosmic-blue/20">
          <TabsTrigger
            value="general"
            className="data-[state=active]:bg-cosmic-blue/20 data-[state=active]:text-cosmic-blue"
          >
            General Settings
          </TabsTrigger>
          <TabsTrigger
            value="questions"
            className="data-[state=active]:bg-cosmic-purple/20 data-[state=active]:text-cosmic-purple"
          >
            Questions
          </TabsTrigger>
          <TabsTrigger
            value="avatar"
            className="data-[state=active]:bg-cosmic-cyan/20 data-[state=active]:text-cosmic-cyan"
          >
            Avatar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card className="cosmic-card backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-cosmic-blue">General Settings</CardTitle>
              <CardDescription className="text-gray-400">
                Configure the basic parameters of your interview session.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="position" className="text-gray-300">
                  Position/Role
                </Label>
                <Input
                  id="position"
                  placeholder="e.g. Frontend Developer"
                  className="bg-cosmic-darker border-cosmic-blue/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry" className="text-gray-300">
                  Industry
                </Label>
                <Select>
                  <SelectTrigger className="bg-cosmic-darker border-cosmic-blue/20">
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent className="bg-cosmic-dark border-cosmic-blue/20">
                    <SelectItem value="tech">Technology</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Interview Difficulty</Label>
                <div className="pt-2">
                  <Slider
                    value={[difficulty]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(value) => setDifficulty(value[0])}
                    className="[&>span]:bg-cosmic-blue"
                  />
                  <div className="flex justify-between mt-1 text-sm text-gray-400">
                    <span>Beginner</span>
                    <span>Intermediate</span>
                    <span>Expert</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Interview Duration</Label>
                <Select defaultValue="30">
                  <SelectTrigger className="bg-cosmic-darker border-cosmic-blue/20">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent className="bg-cosmic-dark border-cosmic-blue/20">
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="feedback" className="text-gray-300">
                  Real-time Feedback
                </Label>
                <Switch id="feedback" className="bg-cosmic-darker data-[state=checked]:bg-cosmic-blue" />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="recording" className="text-gray-300">
                  Record Session
                </Label>
                <Switch
                  id="recording"
                  defaultChecked
                  className="bg-cosmic-darker data-[state=checked]:bg-cosmic-blue"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="questions">
          <Card className="cosmic-card backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-cosmic-purple">Interview Questions</CardTitle>
              <CardDescription className="text-gray-400">
                Customize the questions that will be asked during your interview.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="text-gray-300">Question Categories</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="technical"
                      defaultChecked
                      className="bg-cosmic-darker data-[state=checked]:bg-cosmic-purple"
                    />
                    <Label htmlFor="technical" className="text-gray-300">
                      Technical Skills
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="behavioral"
                      defaultChecked
                      className="bg-cosmic-darker data-[state=checked]:bg-cosmic-purple"
                    />
                    <Label htmlFor="behavioral" className="text-gray-300">
                      Behavioral
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="situational"
                      defaultChecked
                      className="bg-cosmic-darker data-[state=checked]:bg-cosmic-purple"
                    />
                    <Label htmlFor="situational" className="text-gray-300">
                      Situational
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="background"
                      defaultChecked
                      className="bg-cosmic-darker data-[state=checked]:bg-cosmic-purple"
                    />
                    <Label htmlFor="background" className="text-gray-300">
                      Background
                    </Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Custom Questions</Label>
                <div className="space-y-2">
                  <Input
                    placeholder="Enter a custom question..."
                    className="bg-cosmic-darker border-cosmic-purple/20"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-cosmic-purple text-cosmic-purple hover:bg-cosmic-purple/10"
                  >
                    Add Question
                  </Button>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="p-2 bg-cosmic-darker rounded-md flex justify-between items-center border border-cosmic-purple/20">
                    <span className="text-gray-300">Tell me about a challenging project you worked on.</span>
                    <Button variant="ghost" size="sm" className="text-cosmic-purple hover:bg-cosmic-purple/10">
                      Remove
                    </Button>
                  </div>
                  <div className="p-2 bg-cosmic-darker rounded-md flex justify-between items-center border border-cosmic-purple/20">
                    <span className="text-gray-300">How do you handle tight deadlines?</span>
                    <Button variant="ghost" size="sm" className="text-cosmic-purple hover:bg-cosmic-purple/10">
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="avatar">
          <Card className="cosmic-card backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-cosmic-cyan">Avatar Customization</CardTitle>
              <CardDescription className="text-gray-400">
                Customize the appearance and behavior of your AI interviewer.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="text-gray-300">Avatar Style</Label>
                <div className="grid grid-cols-3 gap-4 pt-2">
                  <div className="border border-cosmic-cyan/20 rounded-md p-2 cursor-pointer hover:border-cosmic-cyan bg-cosmic-darker">
                    <div className="aspect-square bg-cosmic-dark rounded-md mb-2 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full cosmic-gradient-bg"></div>
                    </div>
                    <p className="text-center text-sm text-gray-300">Professional</p>
                  </div>
                  <div className="border border-cosmic-cyan/20 rounded-md p-2 cursor-pointer hover:border-cosmic-cyan bg-cosmic-darker">
                    <div className="aspect-square bg-cosmic-dark rounded-md mb-2 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full cosmic-gradient-bg opacity-70"></div>
                    </div>
                    <p className="text-center text-sm text-gray-300">Casual</p>
                  </div>
                  <div className="border border-cosmic-cyan/20 rounded-md p-2 cursor-pointer hover:border-cosmic-cyan bg-cosmic-darker">
                    <div className="aspect-square bg-cosmic-dark rounded-md mb-2 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full cosmic-gradient-bg opacity-40"></div>
                    </div>
                    <p className="text-center text-sm text-gray-300">Friendly</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Voice Type</Label>
                <Select defaultValue="neutral">
                  <SelectTrigger className="bg-cosmic-darker border-cosmic-cyan/20">
                    <SelectValue placeholder="Select voice type" />
                  </SelectTrigger>
                  <SelectContent className="bg-cosmic-dark border-cosmic-cyan/20">
                    <SelectItem value="neutral">Neutral</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="assertive">Assertive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Speaking Rate</Label>
                <Slider defaultValue={[50]} min={0} max={100} step={1} className="[&>span]:bg-cosmic-cyan" />
                <div className="flex justify-between mt-1 text-sm text-gray-400">
                  <span>Slow</span>
                  <span>Normal</span>
                  <span>Fast</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="expressions" className="text-gray-300">
                  Facial Expressions
                </Label>
                <Switch
                  id="expressions"
                  defaultChecked
                  className="bg-cosmic-darker data-[state=checked]:bg-cosmic-cyan"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-center mt-8">
        <Button size="lg" className="cosmic-button rounded-full">
          Save Settings & Start Interview
        </Button>
      </div>
    </div>
  )
}
