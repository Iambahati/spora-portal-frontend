import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Home, ArrowLeft, Search, HelpCircle } from "lucide-react"
import { useI18n } from "@/lib/i18n/context"

export default function NotFoundPage() {
  const { t } = useI18n()

  const handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back()
    } else {
      window.location.href = '/'
    }
  }

  const popularPages = [
    { label: t("nav.dashboard"), path: "/dashboard", icon: Home },
    { label: t("nav.profile"), path: "/profile", icon: HelpCircle },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-lg w-full">
        {/* Main Error Card */}
        <Card className="border-0 shadow-sm bg-white rounded-3xl overflow-hidden">
          <CardContent className="p-8 md:p-12 text-center">
            {/* Error Illustration */}
            <div className="mb-8">
              <div className="relative mx-auto w-32 h-32 mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-[#eb6e03]/10 to-[#040956]/10 rounded-full"></div>
                <div className="absolute inset-4 bg-gradient-to-br from-[#eb6e03] to-[#eb6e03]/80 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-black text-2xl tracking-tight">404</span>
                </div>
              </div>
            </div>

            {/* Error Message */}
            <div className="mb-10">
              <h1 className="text-4xl md:text-5xl font-black text-[#040956] mb-4 tracking-tight">
                {t("errors.pageNotFound")}
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed max-w-md mx-auto">
                {t("errors.pageNotFoundDescription") || "The page you're looking for doesn't exist. It might have been moved or deleted."}
              </p>
            </div>

            {/* Primary Actions */}
            <div className="space-y-4 mb-8">
              <Link to="/" className="block">
                <Button 
                  size="lg"
                  className="w-full h-14 bg-[#eb6e03] hover:bg-[#eb6e03]/90 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
                >
                  <Home className="h-5 w-5 mr-3" />
                  {t("common.goHome")}
                </Button>
              </Link>
              
              <Button
                onClick={handleGoBack}
                variant="outline"
                size="lg"
                className="w-full h-14 border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 font-semibold rounded-xl transition-all duration-200"
              >
                <ArrowLeft className="h-5 w-5 mr-3" />
                {t("common.goBack")}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Popular Pages Section */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-slate-700 mb-4 text-center">
            {t("common.popularPages") || "Popular pages"}
          </h2>
          
          <div className="grid grid-cols-1 gap-3">
            {popularPages.map((page, index) => {
              const IconComponent = page.icon
              return (
                <Link 
                  key={index}
                  to={page.path}
                  className="group"
                >
                  <Card className="border border-slate-200 hover:border-[#eb6e03]/30 hover:shadow-sm transition-all duration-200 rounded-xl overflow-hidden">
                    <CardContent className="p-4 flex items-center space-x-4">
                      <div className="w-10 h-10 bg-slate-100 group-hover:bg-[#eb6e03]/10 rounded-lg flex items-center justify-center transition-colors duration-200">
                        <IconComponent className="h-5 w-5 text-slate-600 group-hover:text-[#eb6e03] transition-colors duration-200" />
                      </div>
                      <span className="font-medium text-slate-700 group-hover:text-[#040956] transition-colors duration-200">
                        {page.label}
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500 mb-2">
            {t("common.needHelp") || "Need help?"}
          </p>
          <Link 
            to="/support" 
            className="text-[#eb6e03] hover:text-[#eb6e03]/80 font-medium text-sm transition-colors duration-200"
          >
            {t("common.contactSupport") || "Contact Support"}
          </Link>
        </div>
      </div>
    </div>
  )
}
