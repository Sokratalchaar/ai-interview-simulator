import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area
} from "recharts";
import { useTranslation } from "react-i18next";

function ScoreChart({ data }) {
  const { i18n } = useTranslation();
  const formatNumber = (num) => {
    return num?.toLocaleString(i18n.language === "ar" ? "ar-EG" : "en-US");
  };
  return (
    <div className="bg-white p-6 rounded-xl shadow mt-10" dir={i18n.language === "ar" ? "rtl" : "ltr"}>
      
      {/* Title + icon */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">
          Score Progress
        </h2>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>

          {/* 🔥 Gradient */}
          <defs>
            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
            </linearGradient>
          </defs>

          {/* Grid */}
          <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" />

          {/* X axis */}
          <XAxis
  dataKey="date"
  tick={{ fontSize: 12 }}
  reversed={i18n.language === "ar"} // 🔥
/>

          {/* Y axis */}
          <YAxis
  domain={[0, 10]}
  orientation={i18n.language === "ar" ? "right" : "left"}
  tickFormatter={(value) => formatNumber(value)}
  tickMargin={15}        // 👈 زيد المسافة
       // 👈 optional (أجمل)
 
/>
          {/* 🔥 Tooltip احترافي */}
          <Tooltip
            content={({ payload }) => {
              if (!payload || payload.length === 0) return null;

              const point = payload[0].payload;

              return (
                <div className="bg-white border px-3 py-2 rounded-lg shadow">
                  <p className="text-xs text-gray-500">
                    {point.date}
                  </p>
                  <p className="font-bold text-blue-600">
  {formatNumber(point.score)} / {formatNumber(10)}
</p>
                </div>
              );
            }}
          />

          {/* 🔥 Area تحت الخط */}
          <Area
            type="monotone"
            dataKey="score"
            stroke="none"
            fill="url(#colorScore)"
          />

          {/* 🔥 Line ناعم */}
          <Line
            type="monotone"
            dataKey="score"
            stroke="#2563eb"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />

        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ScoreChart;