import React from 'react'
import { Card } from './ui/card'

const Expression = () => {
  return (
        <Card className="p-6 mt-8 bg-gray-800 text-white">
          <h2 className="text-xl font-semibold mb-4">Real-time Analysis</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-700 rounded-lg text-center">
              <p className="font-medium">Confidence</p>
              <p className="text-2xl mt-2">75%</p>
            </div>
            <div className="p-4 bg-gray-700 rounded-lg text-center">
              <p className="font-medium">Eye Contact</p>
              <p className="text-2xl mt-2">82%</p>
            </div>
            <div className="p-4 bg-gray-700 rounded-lg text-center">
              <p className="font-medium">Smile</p>
              <p className="text-2xl mt-2">60%</p>
            </div>
            <div className="p-4 bg-gray-700 rounded-lg text-center">
              <p className="font-medium">Engagement</p>
              <p className="text-2xl mt-2">78%</p>
            </div>
          </div>
        </Card>
    
  );
}

export default Expression