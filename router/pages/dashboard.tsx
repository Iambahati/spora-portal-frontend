import React from "react"
import { useAuthCheck } from "@/router/hooks/use-auth-check"
import { NavigationHeader } from "@/components/navigation-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useI18n } from "@/lib/i18n/context"
import { 
  DollarSign, 
  TrendingUp, 
  PieChart, 
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  FileText,
  Bell
} from "lucide-react"

export default function DashboardPage() {
  const { user } = useAuthCheck()
  const { t } = useI18n()

  // Mock data - in real app this would come from API
  const portfolioData = {
    totalInvested: 125000,
    currentValue: 142500,
    totalReturns: 17500,
    returnPercentage: 14.0,
    goalAmount: 250000,
    goalProgress: 57
  }

  const investments = [
    {
      name: "Technology Fund",
      amount: 45000,
      returns: 6750,
      percentage: 15.0,
      trend: "up"
    },
    {
      name: "Sustainable Energy",
      amount: 35000,
      returns: 5250,
      percentage: 15.0,
      trend: "up"
    },
    {
      name: "Healthcare Index",
      amount: 30000,
      returns: 3600,
      percentage: 12.0,
      trend: "up"
    },
    {
      name: "Global Markets",
      amount: 15000,
      returns: 1900,
      percentage: 12.7,
      trend: "up"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <NavigationHeader 
        user={{
          name: user?.full_name || user?.name,
          email: user?.email,
          avatar: user?.avatar
        }}
        title="Investment Dashboard"
      />

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-[#040956] mb-2">
            Welcome back, {user?.name?.split(' ')[0] || 'Investor'}!
          </h2>
          <p className="text-slate-600 text-lg">
            Here's an overview of your investment portfolio
          </p>
        </div>

        {/* Portfolio Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Total Invested
              </CardTitle>
              <DollarSign className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#040956]">
                ${portfolioData.totalInvested.toLocaleString()}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Across all investments
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Current Value
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#040956]">
                ${portfolioData.currentValue.toLocaleString()}
              </div>
              <div className="flex items-center text-xs text-green-600 mt-1">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +{portfolioData.returnPercentage}% this month
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Total Returns
              </CardTitle>
              <PieChart className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                +${portfolioData.totalReturns.toLocaleString()}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                All-time gains
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Goal Progress
              </CardTitle>
              <Target className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#040956]">
                {portfolioData.goalProgress}%
              </div>
              <Progress 
                value={portfolioData.goalProgress} 
                className="mt-2 h-2"
              />
              <p className="text-xs text-slate-500 mt-1">
                Goal: ${portfolioData.goalAmount.toLocaleString()}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Investment Breakdown */}
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-[#040956]">
                Investment Breakdown
              </CardTitle>
              <CardDescription>
                Your current investment portfolio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {investments.map((investment, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-semibold text-[#040956] mb-1">
                        {investment.name}
                      </h4>
                      <p className="text-sm text-slate-600">
                        ${investment.amount.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-green-600 mb-1">
                        <ArrowUpRight className="h-4 w-4 mr-1" />
                        <span className="font-semibold">
                          +{investment.percentage}%
                        </span>
                      </div>
                      <p className="text-sm text-slate-600">
                        +${investment.returns.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-[#040956]">
                Recent Activity
              </CardTitle>
              <CardDescription>
                Latest transactions and updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-[#040956]">
                      Investment Return
                    </h4>
                    <p className="text-sm text-slate-600">
                      Technology Fund generated returns
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">+$1,250</p>
                    <p className="text-xs text-slate-500">2 hours ago</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-[#040956]">
                      Monthly Report
                    </h4>
                    <p className="text-sm text-slate-600">
                      Your investment report is ready
                    </p>
                  </div>
                  <div className="text-right">
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                    <p className="text-xs text-slate-500 mt-1">1 day ago</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                  <div className="p-2 bg-[#eb6e03] bg-opacity-10 rounded-lg">
                    <FileText className="h-5 w-5 text-[#eb6e03]" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-[#040956]">
                      New Investment Available
                    </h4>
                    <p className="text-sm text-slate-600">
                      Green Energy Fund launched
                    </p>
                  </div>
                  <div className="text-right">
                    <Button size="sm" className="bg-[#eb6e03] hover:bg-[#eb6e03]/90">
                      Explore
                    </Button>
                    <p className="text-xs text-slate-500 mt-1">3 days ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
