import jsPDF from 'jspdf';
import JSZip from 'jszip';
import { Lead } from './supabase';

/**
 * Formata valor em centavos para R$
 */
function formatCurrency(cents: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(cents / 100);
}

/**
 * Formata data
 */
function formatDate(date: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(new Date(date));
}

/**
 * Gerar PDF do briefing
 */
export async function downloadBriefingPDF(lead: Lead) {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  let yPos = 20;

  // Título
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Briefing - Sites Odonto 24H', pageWidth / 2, yPos, { align: 'center' });
  yPos += 15;

  // Linha separadora
  pdf.setDrawColor(128, 90, 213); // Purple
  pdf.setLineWidth(0.5);
  pdf.line(20, yPos, pageWidth - 20, yPos);
  yPos += 10;

  // Informações do Lead
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Informações do Cliente', 20, yPos);
  yPos += 8;

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.text(`Nome: ${lead.nome}`, 20, yPos);
  yPos += 6;
  pdf.text(`Email: ${lead.email}`, 20, yPos);
  yPos += 6;
  pdf.text(`WhatsApp: ${lead.whatsapp}`, 20, yPos);
  yPos += 6;
  pdf.text(`Data de Criação: ${formatDate(lead.created_at)}`, 20, yPos);
  yPos += 6;
  pdf.text(`Status: ${lead.status}`, 20, yPos);
  yPos += 6;
  pdf.text(`Valor Total: ${formatCurrency(lead.valor_total)}`, 20, yPos);
  yPos += 12;

  // Dados do Briefing
  const briefing = lead.briefing_data;

  if (briefing) {
    // Informações Básicas
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.text('Informações da Clínica', 20, yPos);
    yPos += 8;

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    if (briefing.clinicName) {
      pdf.text(`Nome da Clínica: ${briefing.clinicName}`, 20, yPos);
      yPos += 6;
    }
    if (briefing.professionalName) {
      pdf.text(`Profissional: ${briefing.professionalName}`, 20, yPos);
      yPos += 6;
    }
    if (briefing.deadline) {
      pdf.text(`Prazo: ${briefing.deadline}`, 20, yPos);
      yPos += 6;
    }
    if (briefing.siteStyle) {
      pdf.text(`Estilo do Site: ${briefing.siteStyle}`, 20, yPos);
      yPos += 6;
    }
    yPos += 6;

    // Diretor Técnico
    if (briefing.technicalDirector) {
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.text('Diretor Técnico', 20, yPos);
      yPos += 8;

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.text(`Nome: ${briefing.technicalDirector.name}`, 20, yPos);
      yPos += 6;
      pdf.text(`CRO: ${briefing.technicalDirector.cro} - ${briefing.technicalDirector.uf}`, 20, yPos);
      yPos += 12;
    }

    // Serviços
    if (briefing.services && briefing.services.length > 0) {
      if (yPos > 250) {
        pdf.addPage();
        yPos = 20;
      }

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.text('Serviços Oferecidos', 20, yPos);
      yPos += 8;

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);

      const services = briefing.services.join(', ');
      const serviceLines = pdf.splitTextToSize(services, pageWidth - 40);
      pdf.text(serviceLines, 20, yPos);
      yPos += serviceLines.length * 6 + 6;
    }

    // Diferenciais
    if (briefing.differentials && briefing.differentials.length > 0) {
      if (yPos > 250) {
        pdf.addPage();
        yPos = 20;
      }

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.text('Diferenciais', 20, yPos);
      yPos += 8;

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);

      const differentials = briefing.differentials.join(', ');
      const diffLines = pdf.splitTextToSize(differentials, pageWidth - 40);
      pdf.text(diffLines, 20, yPos);
      yPos += diffLines.length * 6 + 6;
    }

    // Endereço
    if (briefing.address) {
      if (yPos > 250) {
        pdf.addPage();
        yPos = 20;
      }

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.text('Endereço', 20, yPos);
      yPos += 8;

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.text(briefing.address, 20, yPos);
      yPos += 12;
    }

    // Redes Sociais
    if (briefing.socialMedia) {
      if (yPos > 250) {
        pdf.addPage();
        yPos = 20;
      }

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.text('Redes Sociais', 20, yPos);
      yPos += 8;

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);

      if (briefing.socialMedia.instagram) {
        pdf.text(`Instagram: ${briefing.socialMedia.instagram}`, 20, yPos);
        yPos += 6;
      }
      if (briefing.socialMedia.facebook) {
        pdf.text(`Facebook: ${briefing.socialMedia.facebook}`, 20, yPos);
        yPos += 6;
      }
      if (briefing.socialMedia.linkedin) {
        pdf.text(`LinkedIn: ${briefing.socialMedia.linkedin}`, 20, yPos);
        yPos += 6;
      }
    }
  }

  // Footer
  const totalPages = pdf.internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(128);
    pdf.text(
      `Sites Odonto 24H - Briefing ID: ${lead.id.substring(0, 8)}`,
      pageWidth / 2,
      pdf.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }

  // Download
  pdf.save(`briefing-${lead.nome.replace(/\s+/g, '-').toLowerCase()}.pdf`);
}

/**
 * Download de imagens em ZIP
 */
export async function downloadImagesZIP(lead: Lead) {
  const zip = new JSZip();
  const briefing = lead.briefing_data;

  if (!briefing) {
    alert('Nenhum dado de briefing encontrado');
    return;
  }

  let imageCount = 0;

  // Helper para baixar imagem
  const addImageToZip = async (url: string, folder: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const extension = blob.type.split('/')[1] || 'jpg';
      zip.folder(folder)?.file(`${filename}.${extension}`, blob);
      imageCount++;
    } catch (error) {
      console.error(`Erro ao baixar imagem ${url}:`, error);
    }
  };

  // Logo
  if (briefing.logoUrl) {
    await addImageToZip(briefing.logoUrl, 'logo', 'logo-clinica');
  }

  // Foto da Clínica
  if (briefing.clinicPhotoUrl) {
    await addImageToZip(briefing.clinicPhotoUrl, 'clinica', 'foto-clinica');
  }

  // Fotos dos Profissionais
  if (briefing.professionals && Array.isArray(briefing.professionals)) {
    for (let i = 0; i < briefing.professionals.length; i++) {
      const prof = briefing.professionals[i];
      if (prof.photoUrl) {
        await addImageToZip(
          prof.photoUrl,
          'profissionais',
          `profissional-${i + 1}-${prof.name?.replace(/\s+/g, '-').toLowerCase() || 'sem-nome'}`
        );
      }
    }
  }

  // Imagens de Depoimentos
  if (briefing.testimonials && Array.isArray(briefing.testimonials)) {
    for (let i = 0; i < briefing.testimonials.length; i++) {
      const testimonial = briefing.testimonials[i];
      if (testimonial.photoUrl) {
        await addImageToZip(
          testimonial.photoUrl,
          'depoimentos',
          `depoimento-${i + 1}-${testimonial.name?.replace(/\s+/g, '-').toLowerCase() || 'sem-nome'}`
        );
      }
    }
  }

  if (imageCount === 0) {
    alert('Nenhuma imagem encontrada para download');
    return;
  }

  // Gerar e baixar ZIP
  const content = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(content);
  const a = document.createElement('a');
  a.href = url;
  a.download = `imagens-${lead.nome.replace(/\s+/g, '-').toLowerCase()}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
