'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { FileText, Building, MapPin, Phone, Mail, Globe, AlertCircle, Scale } from 'lucide-react'

export default function LegalDisclosureContent() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4 pb-6 border-b">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 bg-primary/10 rounded-full">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Legal Disclosure</h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Important legal information about Spora One Trust, our operations, 
          and the information provided on this website.
        </p>
        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
          <Badge variant="outline">Effective: December 2024</Badge>
          <span>•</span>
          <span>Governed by Laws of Kenya</span>
        </div>
      </div>

      {/* Website Operation */}
      <Card className="border-l-4 border-l-primary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            Website Operation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            This website is <strong>operated by Spora One Trust, a duly registered trust under the laws of Kenya</strong>. 
            Our operations are conducted in accordance with Kenyan legal requirements and regulatory frameworks 
            governing trust and financial services.
          </p>
          <div className="mt-4 p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              Our principal office is located at <strong>[insert office address], Nairobi, Kenya</strong>.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Company Information */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
          <Building className="h-6 w-6 text-primary" />
          Company Information
        </h2>
        
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Mail className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-semibold">info@sporaonetrust.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Phone className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-semibold">+254-726857081</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Globe className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Website</p>
                    <a 
                        href="https://www.sporaonetrust.com" 
                        target="_blank" 
                        className="font-semibold text-primary hover:text-primary/80 transition-colors"
                    >
                        www.sporaonetrust.com
                    </a>
                  </div>
                </div>

                {/* <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Principal Office</p>
                    <p className="font-semibold">Nairobi, Kenya</p>
                  </div>
                </div> */}

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Scale className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Legal Structure</p>
                    <p className="font-semibold">Registered Trust</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Information Purpose */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-foreground">Information Purpose</h2>
        
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <h3 className="font-semibold mb-2">General Information Only</h3>
                <p className="text-muted-foreground">
                  <strong>All information provided on this website is intended for general informational purposes only</strong>. 
                  The content is designed to help users understand our services, legal requirements, and operational procedures, 
                  but should not be considered as personalized advice or recommendations.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Accuracy & Reliability */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-foreground">Accuracy & Reliability</h2>
        
        <div className="space-y-4">
          <Card className="border-l-4 border-l-amber-500">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2">No Guarantees</h3>
              <p className="text-muted-foreground">
                Spora One Trust <strong>does not guarantee the accuracy, reliability, or completeness of any information</strong> 
                provided on this website. While we strive to maintain current and accurate information, circumstances 
                and regulations may change without notice.
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2">Right to Update</h3>
              <p className="text-muted-foreground">
                We <strong>reserve the right to update or revise the content at any time</strong> without prior notice. 
                Users are encouraged to regularly review the information and contact us directly for the most 
                current details regarding our services and legal requirements.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* No Solicitation */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-foreground">No Solicitation or Offer</h2>
        
        <Card className="bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <h3 className="font-semibold mb-2 text-red-800 dark:text-red-200">Important Legal Notice</h3>
                <p className="text-muted-foreground mb-4">
                  <strong>Nothing on this site constitutes a solicitation, offer, or recommendation to engage in any investment activity or transaction</strong> 
                  under Kenyan law or any other jurisdiction.
                </p>
                
                <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-red-200 dark:border-red-800">
                  <h4 className="font-medium mb-2">Key Points:</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• This website does not constitute investment advice</li>
                    <li>• No offers or solicitations are being made through this platform</li>
                    <li>• All investment opportunities are subject to separate legal agreements</li>
                    <li>• Professional advice should be sought before making investment decisions</li>
                    <li>• Compliance with applicable laws and regulations is required</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Regulatory Compliance */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-foreground">Regulatory Compliance</h2>
        
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground mb-4">
              Spora One Trust operates in compliance with relevant Kenyan laws and regulations, including but not limited to:
            </p>
            
            <div className="grid gap-3 md:grid-cols-2">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-sm">Trustee Act (Cap. 167)</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-sm">Data Protection Act, 2019</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-sm">Proceeds of Crime and Anti-Money Laundering Act</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-sm">Companies Act, 2015</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Limitation of Liability */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-foreground">Limitation of Liability</h2>
        
        <Card className="border-l-4 border-l-gray-500">
          <CardContent className="pt-6">
            <p className="text-muted-foreground mb-4">
              To the fullest extent permitted by law, Spora One Trust disclaims all liability for:
            </p>
            
            <ul className="space-y-2 text-sm text-muted-foreground mb-4">
              <li>• Any reliance placed on information provided on this website</li>
              <li>• Decisions made based on website content</li>
              <li>• Technical errors or omissions in the information</li>
              <li>• Temporary unavailability of the website or services</li>
              <li>• Third-party content or external links</li>
            </ul>

            <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                <strong>Recommendation:</strong> Users should verify all information independently and 
                seek professional advice before making any financial or legal decisions.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contact Information */}
      <Card className="border-2 border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            Legal Inquiries
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            For legal inquiries, compliance questions, or clarification on any information provided:
          </p>
          <div className="grid gap-2 md:grid-cols-2 text-sm">
            <div><strong>Email:</strong> info@sporaonetrust.com</div>
            <div><strong>Phone:</strong> +254-726857081</div>
            <div><strong>Jurisdiction:</strong> Kenya</div>
          </div>
          
          <Separator className="my-4" />
          
          <p className="text-xs text-muted-foreground">
            This disclosure is governed by the laws of Kenya. Any disputes arising from the use of this 
            website or reliance on its information shall be resolved in Kenyan courts.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
