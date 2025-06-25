import React, { useState } from "react"
import { useAuthCheck } from "@/router/hooks/use-auth-check"
import { NavigationHeader } from "@/components/navigation-header"
import AppFooter from "@/components/professional-footer"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useI18n } from "@/lib/i18n/context"
import { 
  Shield, 
  Target, 
  PieChart, 
  Users, 
  Building2, 
  Gavel, 
  TrendingUp,
  Globe,
  Star,
  ChevronRight
} from "lucide-react"

const AboutUsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("governance")
  const { t } = useI18n()
  const { user } = useAuthCheck()

  // Fund allocation data for the chart
  const fundAllocation = [
    { label: "Bank Acquisition", amount: "40-50M", percentage: 42, color: "bg-primary" },
    { label: "Capital Reserve Buffer", amount: "10-20M", percentage: 17, color: "bg-blue-500" },
    { label: "Technology & Infrastructure", amount: "8-12M", percentage: 11, color: "bg-green-500" },
    { label: "Regulatory & Legal", amount: "5-10M", percentage: 8, color: "bg-purple-500" },
    { label: "Operations & Staffing", amount: "5-8M", percentage: 7, color: "bg-orange-500" },
    { label: "Contingency & Working Capital", amount: "5-10M", percentage: 8, color: "bg-gray-500" },
    { label: "Marketing & Engagement", amount: "2-5M", percentage: 4, color: "bg-pink-500" },
    { label: "Governance & Legal", amount: "2-3M", percentage: 3, color: "bg-indigo-500" },
  ]

  const founders = [
    {
      name: "David Wanjiru",
      title: "Executive Director, Strategic Development and Governance Lead",
      experience: "30+ years",
      highlights: [
        "Executive leadership in public and private sectors",
        "Treasurer of Kenya USA Diaspora SACCO",
        "Multi-million dollar project management experience",
        "Expertise in real estate, fintech, and infrastructure"
      ],
      avatar: "/placeholder-user.jpg"
    },
    {
      name: "Raphael Kilondu", 
      title: "Director, Diaspora Capital Mobilization and Investment Strategist",
      experience: "20+ years",
      highlights: [
        "Former Chairman of Kenya USA Diaspora SACCO",
        "Guided growth to over Kshs 1 billion in assets",
        "International trade and economic ties expertise",
        "Entrepreneurial success in logistics, real estate, agriculture"
      ],
      avatar: "/placeholder-user.jpg"
    },
    {
      name: "Isaac Kasera",
      title: "Director, Technology and Community Development Lead", 
      experience: "15+ years",
      highlights: [
        "CEO of Kagasystems LLC",
        "Community development project leadership",
        "Technology and financial services expertise",
        "Global perspective on diaspora engagement"
      ],
      avatar: "/placeholder-user.jpg"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Navigation Header */}
      <NavigationHeader 
        user={{
          name: user?.name,
          email: user?.email,
          avatar: undefined
        }}
        title="About Us"
        showNotifications={false}
      />
      
      {/* Hero Section */}
      <div className="relative bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <Building2 className="h-12 w-12 text-primary mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                {t("aboutUs.title")}
              </h1>
            </div>
            <p className="text-xl text-gray-600 leading-relaxed">
              {t("aboutUs.subtitle")}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Tab Navigation */}
          <div className="mb-8">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto p-1 bg-gray-100 rounded-2xl">
              <TabsTrigger 
                value="governance" 
                className="flex items-center gap-2 px-4 py-3 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
              >
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">{t("aboutUs.tabs.governance")}</span>
              </TabsTrigger>
              <TabsTrigger 
                value="mission"
                className="flex items-center gap-2 px-4 py-3 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
              >
                <Target className="h-4 w-4" />
                <span className="hidden sm:inline">{t("aboutUs.tabs.mission")}</span>
              </TabsTrigger>
              <TabsTrigger 
                value="funds"
                className="flex items-center gap-2 px-4 py-3 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
              >
                <PieChart className="h-4 w-4" />
                <span className="hidden sm:inline">{t("aboutUs.tabs.funds")}</span>
              </TabsTrigger>
              <TabsTrigger 
                value="team"
                className="flex items-center gap-2 px-4 py-3 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
              >
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">{t("aboutUs.tabs.team")}</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab Content */}
          <div className="min-h-[600px]">
            {/* Governance Tab */}
            <TabsContent value="governance" className="mt-0">
              <Card className="border-0 shadow-lg rounded-3xl overflow-hidden">
                <CardContent className="p-8 md:p-12">
                  <div className="flex items-center gap-3 mb-8">
                    <Shield className="h-8 w-8 text-primary" />
                    <h2 className="text-3xl font-bold text-gray-900">{t("aboutUs.governance.title")}</h2>
                  </div>
                  
                  <div className="grid gap-8 md:grid-cols-2">
                    <div className="space-y-6">
                      <div className="p-6 bg-gray-50 rounded-2xl">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Building2 className="h-5 w-5 text-primary" />
                          {t("aboutUs.governance.ownership.title")}
                        </h3>
                        <p className="text-gray-700">
                          {t("aboutUs.governance.ownership.owner")}
                        </p>
                        <p className="text-gray-700 mt-2">
                          {t("aboutUs.governance.ownership.subsidiary")}
                        </p>
                      </div>

                      <div className="p-6 bg-gray-50 rounded-2xl">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Users className="h-5 w-5 text-primary" />
                          {t("aboutUs.governance.board.title")}
                        </h3>
                        <p className="text-gray-700">
                          {t("aboutUs.governance.board.description")}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="p-6 bg-gray-50 rounded-2xl">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Gavel className="h-5 w-5 text-primary" />
                          {t("aboutUs.governance.oversight.title")}
                        </h3>
                        <ul className="space-y-2 text-gray-700">
                          <li className="flex items-center gap-2">
                            <ChevronRight className="h-4 w-4 text-primary" />
                            {t("aboutUs.governance.oversight.trustees")}
                          </li>
                          <li className="flex items-center gap-2">
                            <ChevronRight className="h-4 w-4 text-primary" />
                            {t("aboutUs.governance.oversight.audit")}
                          </li>
                          <li className="flex items-center gap-2">
                            <ChevronRight className="h-4 w-4 text-primary" />
                            {t("aboutUs.governance.oversight.investment")}
                          </li>
                          <li className="flex items-center gap-2">
                            <ChevronRight className="h-4 w-4 text-primary" />
                            {t("aboutUs.governance.oversight.diaspora")}
                          </li>
                        </ul>
                      </div>

                      <div className="p-6 bg-gray-50 rounded-2xl">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Globe className="h-5 w-5 text-primary" />
                          {t("aboutUs.governance.regulatory.title")}
                        </h3>
                        <p className="text-gray-700">
                          {t("aboutUs.governance.regulatory.description")}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 p-6 bg-gradient-to-r from-primary/10 to-blue-50 rounded-2xl">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Star className="h-5 w-5 text-primary" />
                      {t("aboutUs.governance.transparency.title")}
                    </h3>
                    <p className="text-gray-700">
                      {t("aboutUs.governance.transparency.description")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Mission Tab */}
            <TabsContent value="mission" className="mt-0">
              <Card className="border-0 shadow-lg rounded-3xl overflow-hidden">
                <CardContent className="p-8 md:p-12">
                  <div className="flex items-center gap-3 mb-8">
                    <Target className="h-8 w-8 text-primary" />
                    <h2 className="text-3xl font-bold text-gray-900">{t("aboutUs.mission.title")}</h2>
                  </div>
                  
                  <div className="max-w-4xl mx-auto text-center">
                    <div className="mb-12">
                      <p className="text-xl text-gray-700 leading-relaxed mb-8">
                        {t("aboutUs.mission.description")}
                      </p>
                      
                      <p className="text-lg text-gray-600 leading-relaxed">
                        {t("aboutUs.mission.subtitle")}
                      </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-3">
                      <div className="p-6 bg-gradient-to-br from-primary/10 to-blue-50 rounded-2xl">
                        <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{t("aboutUs.mission.pillars.wealth.title")}</h3>
                        <p className="text-gray-600">
                          {t("aboutUs.mission.pillars.wealth.description")}
                        </p>
                      </div>

                      <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl">
                        <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{t("aboutUs.mission.pillars.community.title")}</h3>
                        <p className="text-gray-600">
                          {t("aboutUs.mission.pillars.community.description")}
                        </p>
                      </div>

                      <div className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl">
                        <Globe className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{t("aboutUs.mission.pillars.growth.title")}</h3>
                        <p className="text-gray-600">
                          {t("aboutUs.mission.pillars.growth.description")}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Fund Allocation Tab */}
            <TabsContent value="funds" className="mt-0">
              <Card className="border-0 shadow-lg rounded-3xl overflow-hidden">
                <CardContent className="p-8 md:p-12">
                  <div className="flex items-center gap-3 mb-8">
                    <PieChart className="h-8 w-8 text-primary" />
                    <h2 className="text-3xl font-bold text-gray-900">{t("aboutUs.funds.title")}</h2>
                  </div>

                  <div className="text-center mb-8">
                    <Badge variant="outline" className="text-lg px-4 py-2 font-semibold">
                      {t("aboutUs.funds.goal")}
                    </Badge>
                  </div>

                  {/* Fund Distribution Table */}
                  <div className="max-w-4xl mx-auto">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
                      {t("aboutUs.funds.distribution")}
                    </h3>
                    
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-blue-600 text-white">
                              <th className="px-6 py-4 text-left font-semibold">
                                Use of Funds
                              </th>
                              <th className="px-6 py-4 text-left font-semibold">
                                Estimated Amount (USD)
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {fundAllocation.map((item, index) => (
                              <tr key={index} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 text-gray-900 font-medium">
                                  {getTranslatedLabel(item.label, t)}
                                </td>
                                <td className="px-6 py-4 text-gray-700">
                                  {item.amount} million
                                </td>
                              </tr>
                            ))}
                            <tr className="bg-gray-100">
                              <td className="px-6 py-4 text-gray-900 font-bold">
                                Total
                              </td>
                              <td className="px-6 py-4 text-gray-900 font-bold">
                                70–120 million
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Additional Details */}
                    <div className="mt-8">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">
                        {t("aboutUs.funds.breakdown")}
                      </h4>
                      <div className="grid gap-4 md:grid-cols-2">
                        {fundAllocation.map((item, index) => (
                          <div key={index} className="p-4 bg-gray-50 rounded-xl">
                            <h5 className="font-medium text-gray-900 mb-2">
                              {getTranslatedLabel(item.label, t)}
                            </h5>
                            <p className="text-sm text-gray-600">
                              {getTranslatedDescription(item.label, t)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Team Tab */}
            <TabsContent value="team" className="mt-0">
              <Card className="border-0 shadow-lg rounded-3xl overflow-hidden">
                <CardContent className="p-8 md:p-12">
                  <div className="flex items-center gap-3 mb-8">
                    <Users className="h-8 w-8 text-primary" />
                    <h2 className="text-3xl font-bold text-gray-900">{t("aboutUs.team.title")}</h2>
                  </div>

                  <p className="text-lg text-gray-600 text-center mb-12 max-w-4xl mx-auto">
                    {t("aboutUs.team.description")}
                  </p>

                  <div className="grid gap-8 lg:grid-cols-3">
                    {founders.map((founder, index) => (
                      <Card key={index} className="border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="text-center mb-6">
                            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-200 overflow-hidden">
                              <img 
                                src={founder.avatar} 
                                alt={founder.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{founder.name}</h3>
                            <p className="text-sm text-gray-600 mb-2">{founder.title}</p>
                            <Badge variant="secondary" className="text-xs">
                              {founder.experience} {t("aboutUs.team.experience")}
                            </Badge>
                          </div>

                          <div className="space-y-3">
                            <h4 className="font-semibold text-gray-900 text-sm">{t("aboutUs.team.highlights")}</h4>
                            <ul className="space-y-2">
                              {founder.highlights.map((highlight, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <ChevronRight className="h-3 w-3 text-primary mt-1 flex-shrink-0" />
                                  <span className="text-xs text-gray-600">{highlight}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Collective Vision */}
                  <div className="mt-12 p-8 bg-gradient-to-r from-primary/10 via-blue-50 to-purple-50 rounded-2xl">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">{t("aboutUs.team.vision.title")}</h3>
                    <p className="text-gray-700 leading-relaxed text-center max-w-4xl mx-auto">
                      {t("aboutUs.team.vision.description")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Professional Footer */}
      <AppFooter />
    </div>
  )
}

// Helper functions to get translated fund allocation labels and descriptions
function getTranslatedLabel(label: string, t: any): string {
  const labelMap: Record<string, string> = {
    "Bank Acquisition": t("aboutUs.funds.allocation.bankAcquisition.label"),
    "Capital Reserve Buffer": t("aboutUs.funds.allocation.capitalReserve.label"),
    "Technology & Infrastructure": t("aboutUs.funds.allocation.technology.label"),
    "Regulatory & Legal": t("aboutUs.funds.allocation.regulatory.label"),
    "Operations & Staffing": t("aboutUs.funds.allocation.operations.label"),
    "Contingency & Working Capital": t("aboutUs.funds.allocation.contingency.label"),
    "Marketing & Engagement": t("aboutUs.funds.allocation.marketing.label"),
    "Governance & Legal": t("aboutUs.funds.allocation.governance.label")
  }
  return labelMap[label] || label
}

function getTranslatedDescription(label: string, t: any): string {
  const descriptionMap: Record<string, string> = {
    "Bank Acquisition": t("aboutUs.funds.allocation.bankAcquisition.description"),
    "Capital Reserve Buffer": t("aboutUs.funds.allocation.capitalReserve.description"),
    "Technology & Infrastructure": t("aboutUs.funds.allocation.technology.description"),
    "Regulatory & Legal": t("aboutUs.funds.allocation.regulatory.description"),
    "Operations & Staffing": t("aboutUs.funds.allocation.operations.description"),
    "Contingency & Working Capital": t("aboutUs.funds.allocation.contingency.description"),
    "Marketing & Engagement": t("aboutUs.funds.allocation.marketing.description"),
    "Governance & Legal": t("aboutUs.funds.allocation.governance.description")
  }
  return descriptionMap[label] || ""
}

export default AboutUsPage
