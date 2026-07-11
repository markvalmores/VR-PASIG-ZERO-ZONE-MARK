import React, { useState, useEffect } from "react";
import { CreditCard, Calendar, Clock, Copy, Check, ExternalLink, CalendarCheck2, ShieldCheck, DollarSign } from "lucide-react";
import { Booking } from "../types";

interface BookingSystemProps {
  lowGraphics: boolean;
}

export default function BookingSystem({ lowGraphics }: BookingSystemProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("13:00 - 14:00 (1 Hour)");
  const [gCashNumber, setGCashNumber] = useState("");
  const [selectedRate, setSelectedRate] = useState<number>(250);
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  // Fetch bookings list
  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/bookings");
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      }
    } catch (err) {
      console.error("Error loading bookings database:", err);
    }
  };

  useEffect(() => {
    fetchBookings();
    const interval = setInterval(fetchBookings, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleCopyGCash = () => {
    navigator.clipboard.writeText("09763329358");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !date || !gCashNumber) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          date,
          timeSlot,
          gCashNumber,
          amount: selectedRate
        })
      });

      if (res.ok) {
        setSuccessMsg(true);
        setName("");
        setPhone("");
        setGCashNumber("");
        await fetchBookings();
        setTimeout(() => setSuccessMsg(false), 6000);
      }
    } catch (err) {
      console.error("Failed to submit booking transaction:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const ratesList = [
    { name: "Standard Room VR Cabin", price: 150, desc: "Oculus Quest 3 standalone cabin. Includes room tracking.", label: "150/hr" },
    { name: "Pro Console Station (PS5)", price: 250, desc: "High fidelity Gran Turismo 7 setup with direct drive rig.", label: "250/hr" },
    { name: "VIP Group lounge Area", price: 500, desc: "Whole multi-user space with retro arcade and HTC Vive setups.", label: "500/hr" }
  ];

  return (
    <div className="space-y-6">
      {/* Introduction banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-6 shadow-2xl space-y-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 rounded-full bg-cyan-500 animate-pulse" />
          <h2 className="text-xl md:text-2xl font-display font-bold text-white tracking-tight">
            Schedule a VR Session // GCash Vault
          </h2>
        </div>
        <p className="text-xs text-slate-400">
          Book your slot instantly below, make your payment through GCash, and send your receipt link directly to our Facebook representative!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Step 1 & 2: Booking Form & GCash payment */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-6 shadow-xl space-y-6">
          {/* Select Rates Card */}
          <div>
            <h3 className="text-xs font-mono font-bold text-slate-300 tracking-wider uppercase mb-3 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-cyan-400" />
              <span>1. Select Setup Experience</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {ratesList.map((rate) => (
                <button
                  key={rate.price}
                  type="button"
                  onClick={() => setSelectedRate(rate.price)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between h-28 ${
                    selectedRate === rate.price
                      ? "bg-gradient-to-br from-cyan-950/40 to-violet-950/40 border-cyan-500/70 shadow-lg"
                      : "bg-slate-950/40 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div>
                    <p className="text-xs font-bold text-slate-100">{rate.name}</p>
                    <p className="text-[10px] text-slate-400 leading-snug mt-1 line-clamp-2">{rate.desc}</p>
                  </div>
                  <p className="text-sm font-display font-black text-cyan-400 mt-2">PHP {rate.label}</p>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleBookingSubmit} className="space-y-4">
            <h3 className="text-xs font-mono font-bold text-slate-300 tracking-wider uppercase pb-2 border-b border-slate-850 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-violet-400" />
              <span>2. Reservation details</span>
            </h3>

            {successMsg && (
              <div className="bg-emerald-950/30 border border-emerald-500/50 p-3.5 rounded-xl text-xs text-emerald-400 space-y-1.5 animate-pulse">
                <p className="font-bold">✓ Booking Submitted Successfully!</p>
                <p className="text-[10px] text-slate-300 leading-normal">
                  Your pending ticket has been generated. Please copy your GCash reference ID, send the payment, and click &apos;Send Receipt&apos; to submit on our Facebook!
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="Juan Dela Cruz"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500/50 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Mobile Number</label>
                <input
                  type="tel"
                  placeholder="0917-XXXX-XXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500/50 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Reservation Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500/50 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none transition-colors cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Time Slot Duration</label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500/50 rounded-lg px-2 py-2 text-xs text-slate-300 focus:outline-none transition-colors cursor-pointer"
                >
                  <option value="10:00 - 11:00">10:00 AM - 11:00 AM (1 Hour)</option>
                  <option value="13:00 - 14:00">01:00 PM - 02:00 PM (1 Hour)</option>
                  <option value="15:00 - 17:00">03:00 PM - 05:00 PM (2 Hours)</option>
                  <option value="18:00 - 20:00">06:00 PM - 08:00 PM (2 Hours)</option>
                  <option value="20:00 - 22:00">08:00 PM - 10:00 PM (2 Hours)</option>
                </select>
              </div>
            </div>

            {/* GCash Verification Inputs */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-sky-400 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">Send Payment to GCash</h4>
                    <p className="text-[10px] text-slate-400">Account: <span className="text-slate-200 font-semibold">MARK A.</span></p>
                  </div>
                </div>

                <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 w-full md:w-auto">
                  <span className="text-xs font-mono font-bold text-cyan-400 select-all">09763329358</span>
                  <button
                    type="button"
                    onClick={handleCopyGCash}
                    className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200 transition-colors ml-auto cursor-pointer"
                    title="Copy GCash Number"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                  GCash Sender Reference Number (13 Digits)
                </label>
                <input
                  type="text"
                  placeholder="Ref No: 5002 XXXXXXXXX"
                  value={gCashNumber}
                  onChange={(e) => setGCashNumber(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500/50 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-400 hover:to-violet-400 text-slate-950 font-display font-extrabold rounded-lg shadow-lg text-xs tracking-wider uppercase transition-all duration-200 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? "Generating Ticket..." : `Book Session (PHP ${selectedRate}.00)`}
            </button>
          </form>
        </div>

        {/* Step 3: FB messenger submission & Pending bookings list */}
        <div className="lg:col-span-4 space-y-6">
          {/* Submit receipt link box */}
          <div className="bg-gradient-to-br from-violet-950/40 to-slate-900 border border-violet-500/40 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-start gap-2.5">
              <CalendarCheck2 className="w-5 h-5 text-violet-400 mt-0.5 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-slate-100">3. Facebook Receipt Verification</h4>
                <p className="text-[10px] text-slate-350 leading-relaxed mt-1">
                  To complete confirmation, please send your GCash screenshot receipt to our official Facebook Messenger chat channel:
                </p>
              </div>
            </div>

            <a
              href="https://www.facebook.com/usagyuunvtuber5/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 bg-slate-950 hover:bg-slate-900 text-violet-300 font-display font-bold rounded-lg border border-violet-500/40 hover:border-violet-400/60 transition-all text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <span>Submit Screenshot Receipt</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Active Bookings Registry */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col justify-between h-72">
            <div>
              <h3 className="text-[10px] font-mono font-bold tracking-wider text-slate-350 uppercase mb-3.5 pb-2 border-b border-slate-800">
                ACTIVE QUEUE DATABASE
              </h3>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1.5">
                {bookings.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-xs text-slate-500">No active sessions in queue</p>
                  </div>
                ) : (
                  bookings.map((b) => (
                    <div
                      key={b.id}
                      className="text-xs p-2.5 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1 flex justify-between items-center"
                    >
                      <div>
                        <p className="font-bold text-slate-200">{b.name}</p>
                        <p className="text-[10px] text-slate-400">Date: {b.date} • {b.timeSlot}</p>
                        <p className="text-[9px] font-mono text-slate-500">GCash Ref: {b.gCashNumber}</p>
                      </div>

                      <div className="text-right">
                        <span className={`inline-block text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          b.status === "confirmed"
                            ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                            : "bg-amber-950 text-amber-400 border border-amber-800"
                        }`}>
                          {b.status}
                        </span>
                        <p className="text-[10px] font-mono text-cyan-400 font-bold mt-1">₱{b.amount}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-850 flex items-center gap-1.5 text-[9px] text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Symmetrical 1 Gbps servers guard queue updates.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
