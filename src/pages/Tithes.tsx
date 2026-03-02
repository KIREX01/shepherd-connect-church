import { TithesTracker } from '@/components/TithesTracker';

export default function Tithes() {
  return (
    <div className="p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tithes & Offerings</h1>
          <p className="text-muted-foreground mt-2">
            Track and manage tithe contributions and offerings.
          </p>
        </div>
        <TithesTracker />
      </div>
    </div>
  );
}