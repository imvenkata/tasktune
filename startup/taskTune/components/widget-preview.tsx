import { Card } from "@/components/ui/card"
import { Clock, Calendar, CheckCircle2 } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export default function WidgetPreview() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-2">Home Screen Widget</h3>
        <Card className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-[#e2d8f3] flex items-center justify-center mr-2">
                <Clock className="h-4 w-4 text-purple-600" />
              </div>
              <h4 className="font-semibold">taskTune</h4>
            </div>
            <span className="text-sm text-gray-500">11:30 AM</span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium">Current Task</h5>
                <p className="text-sm text-gray-600 dark:text-gray-400">Project Work</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold">25:00</p>
                <p className="text-xs text-gray-500">remaining</p>
              </div>
            </div>

            <Progress value={65} className="h-1.5" />

            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500">Next: Coffee Break (12:00 PM)</p>
            </div>
          </div>
        </Card>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Lock Screen Widget</h3>
        <Card className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-900 text-white">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 rounded-full bg-[#e2d8f3] flex items-center justify-center mr-2">
              <Calendar className="h-4 w-4 text-purple-600" />
            </div>
            <h4 className="font-semibold">Today's Overview</h4>
          </div>

          <div className="space-y-2">
            <div className="flex items-center">
              <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
              <p className="text-sm">Morning Routine</p>
              <span className="text-xs text-gray-400 ml-auto">7:00 AM</span>
            </div>

            <div className="flex items-center">
              <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
              <p className="text-sm">Team Meeting</p>
              <span className="text-xs text-gray-400 ml-auto">9:00 AM</span>
            </div>

            <div className="flex items-center font-medium">
              <div className="h-4 w-4 rounded-full border-2 border-purple-400 mr-2" />
              <p className="text-sm">Project Work</p>
              <span className="text-xs text-purple-400 ml-auto">11:00 AM</span>
            </div>

            <div className="flex items-center">
              <div className="h-4 w-4 rounded-full border-2 border-gray-500 mr-2" />
              <p className="text-sm">Coffee Break</p>
              <span className="text-xs text-gray-400 ml-auto">12:00 PM</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

