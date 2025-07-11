'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Shield, Eye, Lock, Mail, Globe } from 'lucide-react'

export default function PrivacyPolicyContent() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4 pb-6 border-b">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 bg-primary/10 rounded-full">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Privacy Policy</h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Spora One Trust respects your privacy and is committed to protecting your personal data. 
          This policy explains how we collect, use, and safeguard your information.
        </p>
        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
          <Badge variant="outline">Effective: December 2024</Badge>
          <span>•</span>
          <span>Governed by Data Protection Act, 2019 (Kenya)</span>
        </div>
      </div>

      {/* Our Commitment */}
      <Card className="border-l-4 border-l-primary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            Our Privacy Commitment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            Spora One Trust <strong>respects your privacy and is committed to protecting your personal data</strong>. 
            We implement comprehensive safeguards and follow industry best practices to ensure your information 
            remains secure and is used only for legitimate business purposes.
          </p>
        </CardContent>
      </Card>

      {/* Data We Collect */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
          <Eye className="h-6 w-6 text-primary" />
          Data We Collect
        </h2>
        
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Identity Data</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Full name</li>
                <li>• ID number</li>
                <li>• Email address</li>
                <li>• Nationality</li>
                <li>• ID/Driver/Passport No.</li>
                <li>• Passport-sized photo</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Contact Data</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Physical address</li>
                <li>• Phone number</li>
                <li>• Postal address</li>
                <li>• Emergency contacts</li>
                <li>• Communication preferences</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Usage Data</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• IP address</li>
                <li>• Browser information</li>
                <li>• Device details</li>
                <li>• Cookies and tracking</li>
                <li>• Site navigation patterns</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* How We Use Your Data */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-foreground">How We Use Your Data</h2>
        
        <div className="space-y-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2">Service Provision</h3>
              <p className="text-muted-foreground">
                To <strong>provide services or communications you request</strong>, including account management, 
                investment processing, and customer support.
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2">Legal Compliance</h3>
              <p className="text-muted-foreground">
                For <strong>legal compliance</strong> with Kenyan regulations, anti-money laundering requirements, 
                and Know Your Customer (KYC) obligations.
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2">Service Improvement</h3>
              <p className="text-muted-foreground">
                To <strong>improve website functionality</strong>, enhance user experience, and develop 
                new features based on usage patterns and feedback.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Cookies Policy */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-foreground">Cookies & Tracking</h2>
        
        <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Globe className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <h3 className="font-semibold mb-2">Cookie Usage</h3>
                <p className="text-muted-foreground mb-4">
                  This website <strong>uses cookies to enhance user experience and analytics</strong>. 
                  Cookies help us understand how you interact with our site and improve our services.
                </p>
                
                <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border">
                  <h4 className="font-medium mb-2">Cookie Consent</h4>
                  <p className="text-sm text-muted-foreground">
                    A <strong>cookie banner will notify users of cookie usage and seek consent</strong> 
                    in compliance with the Data Protection Act, 2019 (Kenya). You can manage your 
                    cookie preferences at any time through your browser settings.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Your Data Rights */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-foreground">Your Data Rights</h2>
        
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground mb-4">
              You have the right to <strong>request access, correction, or deletion of your personal data</strong>. 
              Under the Data Protection Act, 2019 (Kenya), you are entitled to:
            </p>
            
            <div className="grid gap-3 md:grid-cols-2">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-sm">Access your personal data</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-sm">Correct inaccurate information</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-sm">Request data deletion</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-sm">Object to data processing</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-sm">Data portability</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-sm">Withdraw consent</span>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-primary" />
              <span>For data rights requests, please  contact <strong>info@sporaonetrust.com</strong></span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Measures */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-foreground">Data Security</h2>
        
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="pt-6">
            <p className="text-muted-foreground mb-4">
              Spora One Trust implements <strong>technical and organizational safeguards to secure your data</strong>. 
              Our security measures include:
            </p>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-medium mb-2">Technical Safeguards</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Data encryption in transit and at rest</li>
                  <li>• Secure server infrastructure</li>
                  <li>• Regular security audits</li>
                  <li>• Access controls and monitoring</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Organizational Measures</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Staff training on data protection</li>
                  <li>• Data handling procedures</li>
                  <li>• Incident response protocols</li>
                  <li>• Regular policy reviews</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Jurisdiction */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-foreground">Legal Jurisdiction</h2>
        
        <Card className="bg-slate-50 dark:bg-slate-900/50">
          <CardContent className="pt-6">
            <p className="text-muted-foreground">
              This privacy policy is <strong>governed by the Data Protection Act, 2019 (Kenya)</strong>. 
              Any disputes arising from this policy shall be resolved under Kenyan law and in Kenyan courts.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Contact Information */}
      <Card className="border-2 border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            Contact Our Privacy Team
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            If you have any questions about this privacy policy or your data rights, please contact us:
          </p>
          <div className="grid gap-2 md:grid-cols-2 text-sm">
            <div><strong>Email:</strong> info@sporaonetrust.com</div>
            <div><strong>Phone:</strong> +254-726857081</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
