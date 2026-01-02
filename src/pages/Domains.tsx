import { useState } from 'react';
import { useDomains } from '@/hooks/useDomains';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Globe, Plus, Pencil, Trash2, ExternalLink } from 'lucide-react';
import { Domain } from '@/types';

export default function DomainsPage() {
  const { domains, loading, createDomain, updateDomain, deleteDomain } = useDomains();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingDomain, setEditingDomain] = useState<Domain | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormLoading(true);

    const formData = new FormData(e.currentTarget);
    const domain = {
      name: formData.get('name') as string,
      url: formData.get('url') as string || undefined,
      brand_voice: formData.get('brand_voice') as string || undefined,
      tone: formData.get('tone') as string || undefined,
      target_audience: formData.get('target_audience') as string || undefined,
    };

    const result = await createDomain(domain);
    if (result) {
      setIsCreateOpen(false);
    }
    setFormLoading(false);
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingDomain) return;
    setFormLoading(true);

    const formData = new FormData(e.currentTarget);
    const updates = {
      name: formData.get('name') as string,
      url: formData.get('url') as string || null,
      brand_voice: formData.get('brand_voice') as string || null,
      tone: formData.get('tone') as string || null,
      target_audience: formData.get('target_audience') as string || null,
    };

    await updateDomain(editingDomain.id, updates);
    setEditingDomain(null);
    setFormLoading(false);
  };

  const DomainForm = ({ domain, onSubmit }: { domain?: Domain; onSubmit: (e: React.FormEvent<HTMLFormElement>) => void }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Domain Name *</Label>
        <Input
          id="name"
          name="name"
          defaultValue={domain?.name}
          placeholder="My Awesome Blog"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="url">Website URL</Label>
        <Input
          id="url"
          name="url"
          type="url"
          defaultValue={domain?.url || ''}
          placeholder="https://example.com"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="brand_voice">Brand Voice</Label>
        <Textarea
          id="brand_voice"
          name="brand_voice"
          defaultValue={domain?.brand_voice || ''}
          placeholder="Describe your brand's voice (e.g., professional, friendly, authoritative...)"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tone">Tone</Label>
        <Input
          id="tone"
          name="tone"
          defaultValue={domain?.tone || ''}
          placeholder="e.g., Professional, Casual, Technical"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="target_audience">Target Audience</Label>
        <Textarea
          id="target_audience"
          name="target_audience"
          defaultValue={domain?.target_audience || ''}
          placeholder="Describe your target audience..."
          rows={2}
        />
      </div>

      <DialogFooter>
        <Button type="submit" className="gradient-bg" disabled={formLoading}>
          {formLoading ? 'Saving...' : domain ? 'Update Domain' : 'Create Domain'}
        </Button>
      </DialogFooter>
    </form>
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold">Domains</h1>
            <p className="text-muted-foreground mt-1">
              Manage your brands and websites
            </p>
          </div>

          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-bg">
                <Plus className="mr-2 h-4 w-4" />
                Add Domain
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New Domain</DialogTitle>
                <DialogDescription>
                  Add a new brand or website to generate content for.
                </DialogDescription>
              </DialogHeader>
              <DomainForm onSubmit={handleCreate} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Domains Grid */}
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 w-32 bg-muted rounded" />
                  <div className="h-4 w-48 bg-muted rounded mt-2" />
                </CardHeader>
                <CardContent>
                  <div className="h-20 bg-muted rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : domains.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Globe className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No domains yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first domain to start generating content.
              </p>
              <Button onClick={() => setIsCreateOpen(true)} className="gradient-bg">
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Domain
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {domains.map((domain) => (
              <Card key={domain.id} className="group hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Globe className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{domain.name}</CardTitle>
                        {domain.url && (
                          <a
                            href={domain.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1"
                          >
                            {new URL(domain.url).hostname}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Dialog open={editingDomain?.id === domain.id} onOpenChange={(open) => !open && setEditingDomain(null)}>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setEditingDomain(domain)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                          <DialogHeader>
                            <DialogTitle>Edit Domain</DialogTitle>
                            <DialogDescription>
                              Update your domain settings.
                            </DialogDescription>
                          </DialogHeader>
                          <DomainForm domain={domain} onSubmit={handleUpdate} />
                        </DialogContent>
                      </Dialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Domain</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete "{domain.name}" and all associated blogs and content. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteDomain(domain.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    {domain.tone && (
                      <div>
                        <span className="text-muted-foreground">Tone:</span>{' '}
                        <span>{domain.tone}</span>
                      </div>
                    )}
                    {domain.target_audience && (
                      <div>
                        <span className="text-muted-foreground">Audience:</span>{' '}
                        <span className="line-clamp-2">{domain.target_audience}</span>
                      </div>
                    )}
                    {!domain.tone && !domain.target_audience && (
                      <p className="text-muted-foreground italic">No brand settings configured</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
