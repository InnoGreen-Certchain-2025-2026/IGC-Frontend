import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Header from "@/components/custom/header";
import Footer from "@/components/custom/footer";
import { Search } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen font-sans">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative w-full py-24 lg:py-32 overflow-hidden bg-blue-50/50">
          {/* Background Image - Using img tag for better visibility */}
          <img 
            src="/homepage-hero-bg.png" 
            alt="World Map Background"
            className="absolute inset-0 z-0 w-full h-full object-cover opacity-100"
          />
          <div className="absolute inset-0 z-0 bg-white/60" />




          
          <div className="container relative z-10 mx-auto px-4 flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold text-[#006666] tracking-tight mb-6 leading-tight max-w-4xl">
              Search and Verify <br />
              <span className="text-[#004d4d]">IGC Certification & More</span>
            </h1>
            
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed font-medium">
              The official global database for accredited certificates. Check IGC certification online or verify other 
              international, national, and sector standard certificates with instant alerts.
            </p>

            {/* Search Bar */}
            <div className="relative w-full max-w-3xl mb-16">
              <div className="flex items-center bg-white rounded-full border-2 border-blue-400 p-1.5 shadow-xl shadow-blue-100/50 transition-all focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100">
                <Input 
                  type="text" 
                  placeholder="Enter company by name or certification number" 
                  className="flex-grow bg-transparent border-none shadow-none focus-visible:ring-0 text-lg py-6 h-auto px-6 italic text-gray-400"
                />
                <Button className="bg-[#0088cc] hover:bg-[#0077b3] text-white rounded-full h-12 px-8 flex items-center space-x-2 font-bold transition-all hover:scale-102">
                  <Search className="h-5 w-5" />
                  <span>Search</span>
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-12 md:gap-24 w-full">
              {[
                { label: "Certifications", value: "3,245,888" },
                { label: "Certification Bodies", value: "2,493" },
                { label: "Accreditation Bodies", value: "80" }
              ].map((stat, i) => (
                <div key={i} className="flex flex-col items-center">
                  <span className="text-3xl font-bold text-[#0088cc] mb-1">{stat.value}</span>
                  <span className="text-sm font-semibold text-gray-500 uppercase tracking-widest">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features / Details Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
              {[
                { title: "Blockchain Powered", desc: "Immutability and transparency for every certificate recorded on the chain." },
                { title: "Instant Access", desc: "Check any certificate globally, 24/7 without delays or middle-men." },
                { title: "Tamper Proof", desc: "Digital signatures and cryptographic hashes ensure the data remains original." }
              ].map((feat, i) => (
                <div key={i} className="text-center p-8 rounded-2xl border border-blue-50 bg-blue-50/10 hover:bg-white hover:shadow-xl transition-all duration-300">
                  <div className="h-14 w-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <div className="h-6 w-6 bg-blue-500 rounded-full" />
                  </div>
                  <h3 className="text-xl font-bold text-blue-900 mb-3">{feat.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}


