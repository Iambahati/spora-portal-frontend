'use client'

import { useState } from 'react'
import { Link } from "react-router-dom"
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ArrowLeft, ExternalLink, AlertTriangle } from 'lucide-react'

import { useI18n } from "@/lib/i18n/context"

import PrivacyPolicyContent from './privacy-policy'
import LegalDisclosureContent from './legal-disclosure'
import DisclaimerContent from './disclaimer'

export default function LegalPage() {
const { t } = useI18n()
  const [activeTab, setActiveTab] = useState('privacy')

  const legalTabs = [
    {
      id: 'privacy',
      title: 'Privacy Policy'
    },
    {
      id: 'disclosure',
      title: 'Legal Disclosure'
    },
    {
      id: 'disclaimer',
      title: 'Terms & Disclaimers'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header */}
      <div className="border-b border-border/40 bg-white/80 backdrop-blur-sm dark:bg-slate-900/80">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/dashboard">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Dashboard
                </Button>
              </Link>
              <Separator orientation="vertical" className="h-6" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">Legal Information</h1>
                <p className="text-sm text-muted-foreground">
                  Privacy, terms, and legal disclosures
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="gap-2">
                <ExternalLink className="h-4 w-4" />
                Contact Legal
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-8">
            {/* Left Sidebar Navigation */}
            <div className="w-64 flex-shrink-0">
              <div className="space-y-2">
                {legalTabs.map((tab) => {
                  return (
                    <Card 
                      key={tab.id}
                      className={`cursor-pointer transition-all duration-200 hover:shadow-md border-l-4 ${
                        activeTab === tab.id 
                          ? 'border-l-primary bg-primary/5 dark:bg-primary/10' 
                          : 'border-l-transparent hover:border-l-primary/50'
                      }`}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      <CardHeader className="py-4">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm font-medium">{tab.title}</CardTitle>
                         
                        </div>
                      </CardHeader>
                    </Card>
                  )
                })}
              </div>

              {/* Important Notice in Sidebar */}
              {/* <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-amber-800 dark:text-amber-200 text-sm mb-2">Important Notice</h3>
                    <p className="text-xs text-amber-700 dark:text-amber-300 mb-3 leading-relaxed">
                      These legal documents are governed by the laws of Kenya. Contact our legal team for questions.
                    </p>
                    <div className="space-y-1 text-xs text-amber-700 dark:text-amber-300">
                      <div><strong>Email:</strong> legal@sporaonetrust.com</div>
                      <div><strong>Phone:</strong> +254-726857081</div>
                    </div>
                  </div>
                </div>
              </div> */}
            </div>

            {/* Main Content */}
            <div className="flex-1 mb-8">
              <Card className="border-0 shadow-lg">
                <div className="p-0">
                  {activeTab === 'privacy' && (
                    <ScrollArea className="h-[85vh]">
                      <div className="p-8">
                        <PrivacyPolicyContent />
                      </div>
                    </ScrollArea>
                  )}

                  {activeTab === 'disclosure' && (
                    <ScrollArea className="h-[85vh]">
                      <div className="p-8">
                        <LegalDisclosureContent />
                      </div>
                    </ScrollArea>
                  )}

                  {activeTab === 'disclaimer' && (
                    <ScrollArea className="h-[85vh]">
                      <div className="p-8">
                        <DisclaimerContent />
                      </div>
                    </ScrollArea>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
