export default function Stats() {
  const stats = [
    {
      value: "12k +",
      label: "Premium Homes",
      description: "Carefully selected and verified listings in active cities.",
    },
    {
      value: "4.9 ★",
      label: "Average Rating",
      description: "Consistently rated five stars by thousands of satisfied tenants.",
    },
    {
      value: "100 %",
      label: "Verified Leases",
      description: "Direct landlord signing with fully vetted tenancy agreements.",
    },
  ];

  return (
    <section className="w-full bg-white dark:bg-zinc-950 border-b border-zinc-100 dark:border-zinc-900 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Three Columns Stats Grid with dividers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-zinc-100 dark:divide-zinc-800">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center px-4 md:first:pl-0 md:last:pr-0 space-y-2 pt-8 md:pt-0 first:pt-0"
            >
              {/* Stat Value */}
              <p className="text-5xl md:text-6xl font-black tracking-tight bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                {stat.value}
              </p>
              {/* Stat Label */}
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-200">
                {stat.label}
              </h3>
              {/* Stat Description */}
              <p className="text-xs text-zinc-400 dark:text-zinc-500 max-w-xs leading-relaxed font-medium">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
