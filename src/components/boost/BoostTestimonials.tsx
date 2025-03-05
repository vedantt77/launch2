import { Card } from '@/components/ui/card';

const testimonials = [
  {
    name: 'John Doe',
    role: 'CEO, TechStart',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100&h=100',
    quote: 'Being featured on startups.ad helped us reach our target audience and increased our MRR by 40% within two months.'
  },
  {
    name: 'Jane Smith',
    role: 'Founder, DataFlow',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100',
    quote: 'The exposure we got from startups.ad was incredible. We connected with multiple investors and secured our seed round.'
  }
];

export function BoostTestimonials() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Success Stories</h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.name} className="p-6">
              <div className="flex items-start gap-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold">{testimonial.name}</h3>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  <p className="mt-2">"{testimonial.quote}"</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}