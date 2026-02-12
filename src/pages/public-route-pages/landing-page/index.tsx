import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LandingPage() {
  return (
    <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[80vh]">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-blue-700 tracking-tight mb-4">
          IGC Certificate Verification
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Secure, blockchain-based certificate verification. Trace your credentials with absolute certainty.
        </p>
      </div>

      <Card className="w-full max-w-2xl border-blue-100 shadow-xl shadow-blue-50">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl text-blue-900 font-bold">Trace Certificate</CardTitle>
          <CardDescription>Enter the certificate ID or transaction hash to verify authenticity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex w-full items-center space-x-2 pt-4">
            <Input 
              type="text" 
              placeholder="e.g. 0x123... or IGC-2025-..." 
              className="h-12 border-blue-200 focus-visible:ring-blue-500"
            />
            <Button className="bg-blue-600 hover:bg-blue-700 h-12 px-8 font-semibold">
              Verify Now
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        {[
          { title: "Blockchain Powered", desc: "Immutability and transparency for every certificate." },
          { title: "Instant Access", desc: "Check any certificate globally, 24/7 without delays." },
          { title: "Tamper Proof", desc: "Digital signatures ensure the data remains original." }
        ].map((feat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-blue-50 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-bold text-blue-800 mb-2">{feat.title}</h3>
            <p className="text-sm text-gray-500">{feat.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
