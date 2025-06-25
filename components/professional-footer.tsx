import React from "react"
import { Link } from "react-router-dom"
import { useI18n } from "@/lib/i18n/context"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { 
  Facebook, 
  Twitter, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin,
  Building2
} from "lucide-react"

const AppFooter: React.FC = () => {
  const { t } = useI18n()

  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Information */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <Building2 className="h-8 w-8 text-primary" />
                <h3 className="text-2xl font-bold">{t("footer.company.name")}</h3>
              </div>
              <p className="text-slate-300 text-lg leading-relaxed mb-6 max-w-md">
                {t("footer.company.description")}
              </p>
              
              {/* Contact Information */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-slate-300">
                  <Mail className="h-5 w-5 text-primary" />
                  <a 
                    href="mailto:info@sporaonetrust.com" 
                    className="hover:text-white transition-colors"
                  >
                    info@sporaonetrust.com
                  </a>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                  <Phone className="h-5 w-5 text-primary" />
                  <a 
                    href="tel:+1-800-SPORA-1" 
                    className="hover:text-white transition-colors"
                  >
                    +1 (800) SPORA-1
                  </a>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span>{t("footer.company.address")}</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-6">{t("footer.quickLinks.title")}</h4>
              <ul className="space-y-3">
                <li>
                  <Link 
                    to="/about-us" 
                    className="text-slate-300 hover:text-white transition-colors"
                  >
                    {t("footer.quickLinks.aboutUs")}
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/dashboard" 
                    className="text-slate-300 hover:text-white transition-colors"
                  >
                    {t("footer.quickLinks.dashboard")}
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/kyc-portal" 
                    className="text-slate-300 hover:text-white transition-colors"
                  >
                    {t("footer.quickLinks.kycPortal")}
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/settings" 
                    className="text-slate-300 hover:text-white transition-colors"
                  >
                    {t("footer.quickLinks.settings")}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal & Support */}
            <div>
              <h4 className="text-lg font-semibold mb-6">{t("footer.legal.title")}</h4>
              <ul className="space-y-3">
                <li>
                  <Link 
                    to="/legal" 
                    className="text-slate-300 hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/legal" 
                    className="text-slate-300 hover:text-white transition-colors"
                  >
                    Legal Disclosure
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/legal" 
                    className="text-slate-300 hover:text-white transition-colors"
                  >
                    Terms & Disclaimers
                  </Link>
                </li>
                <li>
                  <a 
                    href="mailto:info@sporaonetrust.com" 
                    className="text-slate-300 hover:text-white transition-colors"
                  >
                    {t("footer.legal.support")}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <Separator className="bg-slate-700" />

        {/* Bottom Footer */}
        <div className="py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Copyright */}
            <div className="text-slate-400 mb-4 md:mb-0">
              <p>© {new Date().getFullYear()} {t("footer.copyright")}</p>
            </div>

            {/* Social Media Links */}
            <div className="flex items-center gap-4">
              <span className="text-slate-400 text-sm">{t("footer.social.followUs")}</span>
              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-400 hover:text-white hover:bg-slate-800 p-2"
                  asChild
                >
                  <a 
                    href="https://linkedin.com/company/spora-one-trust" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-400 hover:text-white hover:bg-slate-800 p-2"
                  asChild
                >
                  <a 
                    href="https://twitter.com/sporaonebank" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    aria-label="Twitter"
                  >
                    <Twitter className="h-5 w-5" />
                  </a>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-400 hover:text-white hover:bg-slate-800 p-2"
                  asChild
                >
                  <a 
                    href="https://facebook.com/sporaonebank" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                  >
                    <Facebook className="h-5 w-5" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default AppFooter
