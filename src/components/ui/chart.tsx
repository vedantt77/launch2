import { Line, LineChart, ResponsiveContainer, Tooltip } from "recharts"

import { Card } from "@/components/ui/card"
import { themes } from "@/lib/themes"

interface ChartData {
  value: number
  [key: string]: any
}

interface ChartProps {
  data: ChartData[]
  className?: string
}

export function Chart({ data, className }: ChartProps) {
  return (
    <Card className={className}>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={themes.light.primary}
            strokeWidth={2}
            dot={false}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                          Value
                        </span>
                        <span className="font-bold text-muted-foreground">
                          {payload[0].value}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              }
              return null
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  )
}