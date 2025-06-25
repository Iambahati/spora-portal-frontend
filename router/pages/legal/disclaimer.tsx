'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { AlertTriangle, FileCheck, Shield, TrendingUp, Scale, RefreshCw, Users } from 'lucide-react'

export default function DisclaimerContent() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4 pb-6 border-b">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 bg-primary/10 rounded-full">
            <AlertTriangle className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Terms & Disclaimers</h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Important terms of use, disclaimers, and legal conditions governing 
          your use of this website and our services.
        </p>
        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
          <Badge variant="outline">Effective: December 2024</Badge>
          <span>•</span>
          <span>Governed by Laws of Kenya</span>
        </div>
      </div>

      {/* Agreement to Terms */}
      <Card className="border-l-4 border-l-primary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="h-5 w-5 text-primary" />
            Agreement to Terms
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            By using this website, <strong>you agree to the following terms</strong>. These terms constitute 
            a binding legal agreement between you and Spora One Trust. If you do not agree with any 
            part of these terms, you should not use this website or our services.
          </p>
          <div className="mt-4 p-4 bg-primary/10 rounded-lg">
            <p className="text-sm font-medium">
              Continued use of this website constitutes acceptance of these terms and any updates made to them.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Intellectual Property */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          Intellectual Property Rights
        </h2>
        
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-3">Content Ownership</h3>
            <p className="text-muted-foreground mb-4">
              All content is the <strong>property of Spora One Trust</strong> and <strong>may not be reproduced without permission</strong>. 
              This includes but is not limited to:
            </p>
            
            <div className="grid gap-3 md:grid-cols-2">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm">Text and written content</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm">Images and graphics</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm">Logos and trademarks</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm">Software and source code</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm">Design and layout</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm">Proprietary methodologies</span>
              </div>
            </div>

            <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                <strong>Permission Required:</strong> Any reproduction, distribution, or modification of content 
                requires express written permission from Spora One Trust.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Acceptable Use */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
          <Users className="h-6 w-6 text-primary" />
          Acceptable Use Policy
        </h2>
        
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground mb-4">
              You agree <strong>not to misuse this website</strong>. Prohibited activities include, but are not limited to:
            </p>
            
            <div className="space-y-4">
              <Card className="border-l-4 border-l-red-500 bg-red-50 dark:bg-red-950/20">
                <CardContent className="pt-4">
                  <h4 className="font-semibold mb-2 text-red-800 dark:text-red-200">Security Violations</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Attempting <strong>unauthorized access</strong> to systems or data</li>
                    <li>• Hacking, cracking, or circumventing security measures</li>
                    <li>• Using automated tools to access the website</li>
                    <li>• Attempting to disrupt website functionality</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-orange-500 bg-orange-50 dark:bg-orange-950/20">
                <CardContent className="pt-4">
                  <h4 className="font-semibold mb-2 text-orange-800 dark:text-orange-200">Malicious Activities</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Sending <strong>spam</strong> or unsolicited communications</li>
                    <li>• Uploading <strong>malicious code</strong>, viruses, or malware</li>
                    <li>• Phishing or attempting to steal user credentials</li>
                    <li>• Distributing harmful or illegal content</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-purple-500 bg-purple-50 dark:bg-purple-950/20">
                <CardContent className="pt-4">
                  <h4 className="font-semibold mb-2 text-purple-800 dark:text-purple-200">Misuse of Services</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Impersonating other users or entities</li>
                    <li>• Creating false or misleading accounts</li>
                    <li>• Violating intellectual property rights</li>
                    <li>• Using the website for illegal purposes</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Disclaimers */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-primary" />
          Financial Disclaimers
        </h2>
        
        <div className="space-y-4">
          <Card className="border-l-4 border-l-amber-500">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2">No Financial Advice</h3>
              <p className="text-muted-foreground">
                <strong>No part of this website constitutes financial advice or a public offer</strong>. 
                All information is provided for educational and informational purposes only. 
                Users should consult with qualified financial advisors before making investment decisions.
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2">Private Investment Opportunities</h3>
              <p className="text-muted-foreground">
                Investment opportunities mentioned are <strong>private and subject to appropriate legal agreements and due diligence</strong>. 
                These opportunities are not public offerings and may only be available to qualified investors 
                who meet specific criteria under applicable securities laws.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Risk Disclaimer */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-foreground">Investment Risk Disclaimer</h2>
        
        <Card className="bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-6 w-6 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-3 text-red-800 dark:text-red-200">Important Risk Warnings</h3>
                
                <div className="space-y-4">
                  <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-red-200 dark:border-red-800">
                    <h4 className="font-medium mb-2">Investment Risks</h4>
                    <p className="text-muted-foreground text-sm">
                      <strong>Investments involve risk, including the possible loss of principal</strong>. 
                      The value of investments may fluctuate and investors may lose some or all of their initial investment.
                    </p>
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-red-200 dark:border-red-800">
                    <h4 className="font-medium mb-2">Past Performance</h4>
                    <p className="text-muted-foreground text-sm">
                      <strong>Past performance does not guarantee future results</strong>. 
                      Historical returns, projections, and estimates are not guarantees of future performance 
                      and actual results may differ materially.
                    </p>
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-red-200 dark:border-red-800">
                    <h4 className="font-medium mb-2">Due Diligence Required</h4>
                    <p className="text-muted-foreground text-sm">
                      Investors must conduct their own due diligence and risk assessment before making any investment decisions. 
                      Professional advice should be sought where appropriate.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Jurisdiction */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
          <Scale className="h-6 w-6 text-primary" />
          Legal Jurisdiction
        </h2>
        
        <Card className="border-l-4 border-l-slate-500">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-3">Governing Law</h3>
            <p className="text-muted-foreground mb-4">
              These terms are <strong>governed by the laws of Kenya</strong>. Any legal disputes, claims, 
              or proceedings arising from or related to these terms or your use of this website shall 
              be subject to Kenyan jurisdiction.
            </p>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Dispute Resolution</h4>
              <p className="text-sm text-muted-foreground">
                All <strong>disputes shall be resolved in Kenyan courts</strong>. By using this website, 
                you agree to submit to the exclusive jurisdiction of the courts of Kenya for the resolution 
                of any disputes arising from these terms.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Changes to Terms */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
          <RefreshCw className="h-6 w-6 text-primary" />
          Changes to Terms
        </h2>
        
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-3">Right to Modify</h3>
            <p className="text-muted-foreground mb-4">
              We <strong>reserve the right to modify these terms at any time without notice</strong>. 
              Changes will be effective immediately upon posting to this website.
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm">Users are responsible for regularly reviewing terms</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm">Continued use implies acceptance of updated terms</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm">Significant changes may be communicated via email</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Severability */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-foreground">Severability</h2>
        
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">
              If any provision of these terms is found to be unenforceable or invalid under applicable law, 
              such provision will be changed and interpreted to accomplish the objectives of such provision 
              to the greatest extent possible under applicable law, and the remaining provisions will continue 
              in full force and effect.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Contact Information */}
      <Card className="border-2 border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="h-5 w-5 text-primary" />
            Questions About These Terms
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            If you have any questions about these terms and disclaimers, please contact us:
          </p>
          <div className="grid gap-2 md:grid-cols-2 text-sm">
            <div><strong>Email:</strong> info@sporaonetrust.com</div>
            <div><strong>Phone:</strong> +254-726857081</div>
            <div><strong>Registration:</strong> TPS-VMCRYQ</div>
            <div><strong>Address:</strong> Nairobi, Kenya</div>
          </div>
          
          <Separator className="my-4" />
          
          <p className="text-xs text-muted-foreground">
            These terms are effective as of December 2024 and are governed by the laws of Kenya. 
            By using this website, you acknowledge that you have read, understood, and agree to be bound by these terms.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
