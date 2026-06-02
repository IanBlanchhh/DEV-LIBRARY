import { prisma } from "./db";
import { hashPassword } from "./auth";
import { seedGuides, extraCategories } from "./seedContent";

export async function seedDatabase() {
  // Seed default admin user
  const existing = await prisma.user.findUnique({
    where: { email: "admin@devlibrary.local" },
  });

  if (!existing) {
    await prisma.user.create({
      data: {
        email: "admin@devlibrary.local",
        name: "Admin",
        password: await hashPassword("admin123"),
        role: "admin",
      },
    });
  }

  // Permanent admin — granted access for the lifetime of this installation
  const permanentAdmin = await prisma.user.findUnique({
    where: { email: "Blancharddamian00@outlook.com" },
  });

  if (!permanentAdmin) {
    await prisma.user.create({
      data: {
        email: "Blancharddamian00@outlook.com",
        name: "Damian Blanchard",
        password: await hashPassword("admin123"),
        role: "admin",
      },
    });
  } else if (permanentAdmin.role !== "admin") {
    await prisma.user.update({
      where: { email: "Blancharddamian00@outlook.com" },
      data: { role: "admin" },
    });
  }

  // Seed site settings
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "singleton" },
  });
  if (!settings) {
    await prisma.siteSettings.create({ data: { id: "singleton" } });
  }

  // Seed default categories
  const cats = [
    {
      name: "Website Foundations",
      slug: "website-foundations",
      description: "HTML, CSS, JavaScript fundamentals and core concepts",
      icon: "globe",
      color: "#6366f1",
      order: 0,
    },
    {
      name: "Layering & Advanced",
      slug: "layering-advanced",
      description: "Advanced patterns, performance, and architecture",
      icon: "layers",
      color: "#8b5cf6",
      order: 1,
    },
    {
      name: "Programs & Tools",
      slug: "programs-tools",
      description: "Dev tools, CLIs, editors, and workflows",
      icon: "terminal",
      color: "#06b6d4",
      order: 2,
    },
    {
      name: "AI Systems",
      slug: "ai-systems",
      description: "LLMs, prompt engineering, AI APIs, and integrations",
      icon: "brain",
      color: "#10b981",
      order: 3,
    },
  ];

  // Ensure all categories exist (base + extras like "Command References")
  const allCats = [...cats, ...extraCategories];
  for (const cat of allCats) {
    const exists = await prisma.category.findUnique({
      where: { slug: cat.slug },
    });
    if (!exists) {
      const created = await prisma.category.create({ data: cat });
      // For categories that don't have rich guides yet, add a starter doc.
      const hasRichGuides = seedGuides.some((g) => g.categorySlug === cat.slug);
      if (!hasRichGuides) {
        await prisma.doc.create({
          data: {
            title: `Getting Started with ${cat.name}`,
            slug: "getting-started",
            content: `# Getting Started with ${cat.name}\n\nWelcome to the **${cat.name}** section. This guide will help you get up to speed.\n\n## Overview\n\nThis category covers ${cat.description.toLowerCase()}.\n\n## Prerequisites\n\n- Basic understanding of programming\n- A code editor (VS Code recommended)\n- Node.js installed\n\n## Step 1: Set up your environment\n\n\`\`\`bash\nnpm init -y\nnpm install\n\`\`\`\n\n## Step 2: Write your first code\n\nStart with a simple example and build from there.\n\n## Resources\n\n- Official documentation\n- Community forums\n- Video tutorials`,
            description: `Introduction to ${cat.name}`,
            categoryId: created.id,
            order: 0,
            tags: '["intro","guide"]',
          },
        });
      }
    }
  }

  // Seed / refresh the rich, comprehensive guides.
  for (const guide of seedGuides) {
    const category = await prisma.category.findUnique({
      where: { slug: guide.categorySlug },
    });
    if (!category) continue;

    await prisma.doc.upsert({
      where: { categoryId_slug: { categoryId: category.id, slug: guide.slug } },
      update: {
        title: guide.title,
        content: guide.content,
        description: guide.description,
        tags: JSON.stringify(guide.tags),
        order: guide.order,
      },
      create: {
        title: guide.title,
        slug: guide.slug,
        content: guide.content,
        description: guide.description,
        tags: JSON.stringify(guide.tags),
        order: guide.order,
        categoryId: category.id,
      },
    });
  }

  // Remove the old thin placeholder from Website Foundations if it exists,
  // now that real guides are present.
  const wf = await prisma.category.findUnique({ where: { slug: "website-foundations" } });
  if (wf) {
    await prisma.doc.deleteMany({
      where: { categoryId: wf.id, slug: "getting-started" },
    });
  }
}
