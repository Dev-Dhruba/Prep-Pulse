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
      <h1 className="text-3xl font-bold mb-8 text-center">Customize Your Interview</h1>

      <Tabs defaultValue="general" className="w-full max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">General Settings</TabsTrigger>
          <TabsTrigger value="questions">Questions</TabsTrigger>
          <TabsTrigger value="avatar">Avatar</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure the basic parameters of your interview session.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="position">Position/Role</Label>
                <Input id="position" placeholder="e.g. Frontend Developer" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tech">Technology</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Interview Difficulty</Label>
                <div className="pt-2">
                  <Slider
                    value={[difficulty]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(value) => setDifficulty(value[0])}
                  />
                  <div className="flex justify-between mt-1 text-sm text-gray-500">
                    <span>Beginner</span>
                    <span>Intermediate</span>
                    <span>Expert</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Interview Duration</Label>
                <Select defaultValue="30">
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="feedback">Real-time Feedback</Label>
                <Switch id="feedback" />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="recording">Record Session</Label>
                <Switch id="recording" defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="questions">
          <Card>
            <CardHeader>
              <CardTitle>Interview Questions</CardTitle>
              <CardDescription>Customize the questions that will be asked during your interview.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Question Categories</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="technical" defaultChecked />
                    <Label htmlFor="technical">Technical Skills</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="behavioral" defaultChecked />
                    <Label htmlFor="behavioral">Behavioral</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="situational" defaultChecked />
                    <Label htmlFor="situational">Situational</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="background" defaultChecked />
                    <Label htmlFor="background">Background</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Custom Questions</Label>
                <div className="space-y-2">
                  <Input placeholder="Enter a custom question..." />
                  <Button variant="outline" size="sm" className="w-full">
                    Add Question
                  </Button>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="p-2 bg-gray-100 rounded-md flex justify-between items-center">
                    <span>Tell me about a challenging project you worked on.</span>
                    <Button variant="ghost" size="sm">
                      Remove
                    </Button>
                  </div>
                  <div className="p-2 bg-gray-100 rounded-md flex justify-between items-center">
                    <span>How do you handle tight deadlines?</span>
                    <Button variant="ghost" size="sm">
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="avatar">
          <Card>
            <CardHeader>
              <CardTitle>Avatar Customization</CardTitle>
              <CardDescription>Customize the appearance and behavior of your AI interviewer.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Avatar Style</Label>
                <div className="grid grid-cols-3 gap-4 pt-2">
                  <div className="border rounded-md p-2 cursor-pointer hover:border-black">
                    <div className="aspect-square bg-gray-200 rounded-md mb-2"></div>
                    <p className="text-center text-sm">Professional</p>
                  </div>
                  <div className="border rounded-md p-2 cursor-pointer hover:border-black">
                    <div className="aspect-square bg-gray-200 rounded-md mb-2"></div>
                    <p className="text-center text-sm">Casual</p>
                  </div>
                  <div className="border rounded-md p-2 cursor-pointer hover:border-black">
                    <div className="aspect-square bg-gray-200 rounded-md mb-2"></div>
                    <p className="text-center text-sm">Friendly</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Voice Type</Label>
                <Select defaultValue="neutral">
                  <SelectTrigger>
                    <SelectValue placeholder="Select voice type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="neutral">Neutral</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="assertive">Assertive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Speaking Rate</Label>
                <Slider defaultValue={[50]} min={0} max={100} step={1} />
                <div className="flex justify-between mt-1 text-sm text-gray-500">
                  <span>Slow</span>
                  <span>Normal</span>
                  <span>Fast</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="expressions">Facial Expressions</Label>
                <Switch id="expressions" defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-center mt-8">
        <Button size="lg" className="bg-black text-white hover:bg-gray-800">
          Save Settings & Start Interview
        </Button>
      </div>
    </div>
  )
}
