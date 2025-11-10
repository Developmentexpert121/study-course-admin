import {
  CheckCircle,
  FileText,
  Trophy,
  Globe,
  Download,
  MessageCircle,
} from "lucide-react";

interface FeaturesTabProps {
  features: string[];
}

export default function FeaturesTab({ features }: FeaturesTabProps) {
  return (
    <div>
      <h3 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
        What You'll Learn
      </h3>

      {features && features.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {features.map((feature: string, index: number) => (
            <div key={index} className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-500" />
              <span className="text-gray-700 dark:text-gray-300">
                {feature.replace(/<[^>]*>/g, "")}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 dark:text-gray-400">
          <FileText className="mx-auto mb-3 h-12 w-12 opacity-50" />
          <p>No specific learning objectives listed for this course.</p>
        </div>
      )}

      {/* Benefits Section */}
      <div className="mt-8 rounded-lg border border-gray-200 p-6 dark:border-gray-700">
        <h4 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Course Benefits
        </h4>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex items-start gap-3">
            <Trophy className="h-5 w-5 flex-shrink-0 text-yellow-500" />
            <div>
              <div className="font-medium text-gray-900 dark:text-white">
                Certificate
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Get certified upon completion
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Globe className="h-5 w-5 flex-shrink-0 text-blue-500" />
            <div>
              <div className="font-medium text-gray-900 dark:text-white">
                Lifetime Access
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Access course content forever
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Download className="h-5 w-5 flex-shrink-0 text-green-500" />
            <div>
              <div className="font-medium text-gray-900 dark:text-white">
                Resources
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Downloadable materials included
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MessageCircle className="h-5 w-5 flex-shrink-0 text-purple-500" />
            <div>
              <div className="font-medium text-gray-900 dark:text-white">
                Support
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Community and instructor support
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
