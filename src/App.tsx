import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  FileText, 
  Database, 
  Cpu, 
  Copy, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ChevronRight,
  Search,
  History,
  Languages
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Toaster, toast } from "sonner";
import { processExamText } from "./services/geminiService";
import { ExamArchive } from "./types";

export default function App() {
  const [inputText, setInputText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ExamArchive | null>(null);
  const [activeTab, setActiveTab] = useState("preview");

  const SAMPLE_TEXT = `Q.14 Select the most appropriate option to fill in the blank.
The government has _________ a new policy to boost the economy.
1. introduced
2. introduction
3. introducing
4. introduces
Question ID : 8161611234
Option 1 ID : 8161614567
Option 2 ID : 8161614568
Option 3 ID : 8161614569
Option 4 ID : 8161614570
Status : Answered
Chosen Option : 1

Q.15 Choose the correct synonym of the word 'ABANDON'.
1. Keep
2. Forsake
3. Support
4. Adopt
Question ID : 8161611235
Option 1 ID : 8161614571
Option 2 ID : 8161614572
Option 3 ID : 8161614573
Option 4 ID : 8161614574
Status : Not Answered
Chosen Option : --`;

  const handleProcess = async () => {
    if (!inputText.trim()) {
      toast.error("Please paste some raw text first.");
      return;
    }

    setIsProcessing(true);
    try {
      const data = await processExamText(inputText);
      setResult(data);
      toast.success("Data processed successfully!");
      setActiveTab("preview");
    } catch (error) {
      console.error(error);
      toast.error("Failed to process text. Please check the input and try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const downloadJson = () => {
    if (!result) return;
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `exam_data_${result.document_info.exam_name.replace(/\s+/g, "_")}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Download started!");
  };

  return (
    <div className="min-h-screen bg-[#E4E3E0] text-[#141414] font-sans selection:bg-[#141414] selection:text-[#E4E3E0]">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="border-b border-[#141414] p-6 flex justify-between items-center bg-[#E4E3E0] sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="bg-[#141414] p-2 rounded-sm">
            <Database className="text-[#E4E3E0] w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tighter uppercase italic font-serif">Longinsent Pro</h1>
            <p className="text-[10px] uppercase tracking-widest opacity-60 font-mono">Lead Data Ingestion System v1.0</p>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <Badge variant="outline" className="border-[#141414] rounded-none font-mono text-[10px]">
            STATUS: OPERATIONAL
          </Badge>
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              <h2 className="font-serif italic text-lg">Raw Input Stream</h2>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 text-[10px] font-mono uppercase opacity-50 hover:opacity-100"
              onClick={() => setInputText(SAMPLE_TEXT)}
            >
              Load Sample Data
            </Button>
          </div>
          
          <Card className="border-[#141414] rounded-none shadow-none bg-transparent">
            <CardContent className="p-0">
              <Textarea 
                placeholder="Paste raw text from SSC, UPSC, TNPSC, RRB response sheets here..."
                className="min-h-[500px] border-none focus-visible:ring-0 rounded-none bg-white/50 font-mono text-sm p-6 resize-none"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
            </CardContent>
          </Card>

          <Button 
            onClick={handleProcess} 
            disabled={isProcessing}
            className="w-full bg-[#141414] text-[#E4E3E0] hover:bg-[#141414]/90 rounded-none h-14 text-lg font-serif italic group transition-all"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing Ingestion...
              </>
            ) : (
              <>
                <Cpu className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                Execute Data Extraction
              </>
            )}
          </Button>

          <div className="grid grid-cols-2 gap-4">
            <div className="border border-[#141414] p-4 font-mono text-[10px] space-y-2 opacity-70">
              <p className="uppercase font-bold border-b border-[#141414] pb-1">Ingestion Rules</p>
              <ul className="space-y-1">
                <li>• 100% Extraction Accuracy</li>
                <li>• Subject Mapping Enabled</li>
                <li>• Tanglish Logic Generation</li>
                <li>• ID Preservation Mode</li>
              </ul>
            </div>
            <div className="border border-[#141414] p-4 font-mono text-[10px] space-y-2 opacity-70">
              <p className="uppercase font-bold border-b border-[#141414] pb-1">System Metrics</p>
              <div className="flex justify-between">
                <span>LATENCY:</span>
                <span>~2.4s</span>
              </div>
              <div className="flex justify-between">
                <span>MODEL:</span>
                <span>GEMINI-3-FLASH</span>
              </div>
              <div className="flex justify-between">
                <span>ENCODING:</span>
                <span>UTF-8 / JSON</span>
              </div>
            </div>
          </div>
        </section>

        {/* Output Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              <h2 className="font-serif italic text-lg">Structured Output Archive</h2>
            </div>
            {result && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="border-[#141414] rounded-none h-8 px-3" onClick={() => copyToClipboard(JSON.stringify(result, null, 2))}>
                  <Copy className="w-3 h-3 mr-2" />
                  <span className="text-[10px] font-mono uppercase">Copy</span>
                </Button>
                <Button variant="outline" size="sm" className="border-[#141414] rounded-none h-8 px-3" onClick={downloadJson}>
                  <Download className="w-3 h-3 mr-2" />
                  <span className="text-[10px] font-mono uppercase">Export</span>
                </Button>
              </div>
            )}
          </div>

          <Card className="border-[#141414] rounded-none shadow-none bg-transparent min-h-[600px] flex flex-col">
            {!result && !isProcessing && (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center opacity-30">
                <Database className="w-16 h-16 mb-4" />
                <p className="font-serif italic text-xl">Awaiting Data Stream...</p>
                <p className="font-mono text-[10px] mt-2 uppercase tracking-widest">Input raw text to begin extraction</p>
              </div>
            )}

            {isProcessing && (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                <div className="relative">
                  <Cpu className="w-16 h-16 mb-4 animate-pulse" />
                  <div className="absolute inset-0 bg-[#141414]/10 blur-xl rounded-full animate-pulse" />
                </div>
                <p className="font-serif italic text-xl">Architecting Data Structure...</p>
                <div className="mt-4 w-48 h-1 bg-[#141414]/10 overflow-hidden">
                  <motion.div 
                    className="h-full bg-[#141414]"
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  />
                </div>
              </div>
            )}

            {result && !isProcessing && (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                <div className="px-6 pt-4 border-b border-[#141414]">
                  <TabsList className="bg-transparent h-auto p-0 gap-6 rounded-none">
                    <TabsTrigger value="preview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#141414] data-[state=active]:bg-transparent px-0 py-2 font-mono text-[10px] uppercase tracking-widest">Preview</TabsTrigger>
                    <TabsTrigger value="json" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#141414] data-[state=active]:bg-transparent px-0 py-2 font-mono text-[10px] uppercase tracking-widest">Raw JSON</TabsTrigger>
                    <TabsTrigger value="stats" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#141414] data-[state=active]:bg-transparent px-0 py-2 font-mono text-[10px] uppercase tracking-widest">Metadata</TabsTrigger>
                  </TabsList>
                </div>

                <div className="flex-1 bg-white/30">
                  <TabsContent value="preview" className="m-0 p-0 h-full">
                    <ScrollArea className="h-[550px]">
                      <div className="p-6 space-y-8">
                        {result.archive_data.map((q, idx) => (
                          <motion.div 
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="space-y-4 border-b border-[#141414]/10 pb-8 last:border-none"
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs font-bold bg-[#141414] text-[#E4E3E0] px-2 py-0.5">Q.{q.q_number}</span>
                                <Badge variant="outline" className="border-[#141414] rounded-none text-[9px] font-mono uppercase">{q.subject}</Badge>
                              </div>
                              <span className="font-mono text-[9px] opacity-50">ID: {q.question_id || "N/A"}</span>
                            </div>
                            
                            <p className="font-serif text-lg leading-snug">{q.question_text}</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {q.options.map((opt, oIdx) => (
                                <div 
                                  key={oIdx} 
                                  className={`p-3 border flex items-center justify-between ${opt.is_correct ? 'border-green-600 bg-green-50' : 'border-[#141414]/20 bg-white/50'}`}
                                >
                                  <span className="text-sm">{opt.text}</span>
                                  {opt.is_correct && <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />}
                                </div>
                              ))}
                            </div>

                            <div className="space-y-3 pt-2">
                              <div className="flex items-center gap-2 text-[#141414]/60">
                                <Languages className="w-4 h-4" />
                                <span className="text-[10px] font-mono uppercase font-bold tracking-wider">Explanation Matrix</span>
                              </div>
                              <div className="grid grid-cols-1 gap-3">
                                <div className="p-4 bg-[#141414] text-[#E4E3E0] rounded-sm">
                                  <p className="text-[9px] font-mono uppercase opacity-50 mb-1">English</p>
                                  <p className="text-sm leading-relaxed">{q.explanation.english}</p>
                                </div>
                                <div className="p-4 border border-[#141414] rounded-sm">
                                  <p className="text-[9px] font-mono uppercase opacity-50 mb-1">Tanglish (Tamil + English)</p>
                                  <p className="text-sm leading-relaxed">{q.explanation.tanglish}</p>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="json" className="m-0 p-0 h-full">
                    <ScrollArea className="h-[550px]">
                      <pre className="p-6 font-mono text-xs leading-relaxed whitespace-pre-wrap">
                        {JSON.stringify(result, null, 2)}
                      </pre>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="stats" className="m-0 p-0 h-full">
                    <div className="p-8 space-y-6">
                      <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-1">
                          <p className="text-[10px] font-mono uppercase opacity-50">Exam Name</p>
                          <p className="font-serif text-2xl italic">{result.document_info.exam_name}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-mono uppercase opacity-50">Year</p>
                          <p className="font-serif text-2xl italic">{result.document_info.exam_year}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-mono uppercase opacity-50">State/Region</p>
                          <p className="font-serif text-2xl italic">{result.document_info.state}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-mono uppercase opacity-50">Total Questions</p>
                          <p className="font-serif text-2xl italic">{result.document_info.total_questions}</p>
                        </div>
                      </div>
                      
                      <Separator className="bg-[#141414]/20" />
                      
                      <div className="space-y-4">
                        <p className="text-[10px] font-mono uppercase font-bold">Subject Distribution</p>
                        <div className="flex flex-wrap gap-2">
                          {Array.from(new Set(result.archive_data.map(q => q.subject))).map(sub => (
                            <Badge key={sub} className="bg-[#141414] text-[#E4E3E0] rounded-none px-3 py-1 font-mono text-[10px]">
                              {sub} ({result.archive_data.filter(q => q.subject === sub).length})
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            )}
          </Card>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#141414] p-6 mt-12 flex justify-between items-center opacity-40 font-mono text-[9px] uppercase tracking-[0.2em]">
        <p>© 2026 Longinsent Pro Data Systems</p>
        <div className="flex gap-8">
          <span>Encrypted Stream</span>
          <span>No-Log Policy</span>
          <span>Terminal Access</span>
        </div>
      </footer>
    </div>
  );
}
