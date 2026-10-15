import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Images, X } from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

// ============================================================
// PROJETOS — as fotos são carregadas automaticamente de
// src/assets/projetos/<Nome do Projeto>/.
// Para ADICIONAR fotos: coloque os arquivos na pasta.
// Para CRIAR um projeto novo: crie a pasta com as fotos e
// adicione uma entrada na lista `projects` abaixo com o
// campo `pasta` igual ao nome da pasta.
// ============================================================

const todasAsFotos = import.meta.glob<string>("../assets/projetos/*/*.{jpg,jpeg,png,webp}", {
  eager: true,
  query: "?url",
  import: "default",
});

function fotosDoProjeto(pasta: string): string[] {
  return Object.entries(todasAsFotos)
    .filter(([caminho]) => caminho.includes(`/projetos/${pasta}/`))
    .sort(([a], [b]) => a.localeCompare(b, "pt-BR", { numeric: true }))
    .map(([, url]) => url);
}

type Project = {
  name: string;
  detail: string;
  description: string;
  cover: string;
  images: string[];
};

function montarProjeto(
  name: string,
  pasta: string,
  detail: string,
  description: string,
): Project {
  const images = fotosDoProjeto(pasta);
  return { name, detail, description, cover: images[2] ?? images[0] ?? "", images };
}

const projects: Project[] = [
  montarProjeto(
    "Casa Alba",
    "Casa Alba",
    "Guaíra / SP",
    "Residência contemporânea que integra conforto, funcionalidade e elegância. A composição de texturas e materiais cria uma atmosfera acolhedora, equilibrando modernidade e a personalidade dos moradores.",
  ),
  montarProjeto(
    "Clínica Delicatta",
    "Clínica Delicatta",
    "Clínica de estética",
    "Ampliação da edificação e desenvolvimento completo dos interiores de uma clínica de estética. Ambientes que unem conforto, sofisticação e funcionalidade, com arquitetura contemporânea, linhas leves, materiais naturais e iluminação cuidadosamente planejada.",
  ),
  montarProjeto(
    "Recepção Bela",
    "Recepção Bela",
    "Recepção de clínica",
    "Primeiro contato entre a clínica e seus pacientes, projetado para transmitir leveza, elegância e acolhimento. Formas curvas, iluminação indireta e paleta de tons claros criam uma atmosfera sofisticada e atemporal.",
  ),
  montarProjeto(
    "Trio",
    "Trio",
    "Dormitórios",
    "Cada um dos três dormitórios foi projetado para refletir a personalidade e as necessidades de seus moradores, equilibrando conforto, funcionalidade e estética em ambientes acolhedores e atemporais.",
  ),
  montarProjeto(
    "Quarto Serene",
    "Quarto Serene",
    "Dormitório adolescente",
    "Dormitório que reflete a personalidade do adolescente, unindo delicadeza, funcionalidade e design contemporâneo. Cores neutras e marcenaria planejada criam um espaço confortável, organizado e acolhedor.",
  ),
  montarProjeto(
    "Barbearia Essencial",
    "Barbearia Essencial",
    "Barbearia",
    "Transformação da barbearia em um espaço de convivência. Design moderno e sofisticado com marcenaria de cores sóbrias, criando uma atmosfera autêntica que reforça o conforto do ambiente.",
  ),
  montarProjeto(
    "Dois Tons",
    "Dois Tons",
    "Clínica de beleza e dormitório",
    "Projeto desenvolvido para uma clínica de beleza e um dormitório, unindo sofisticação, conforto e funcionalidade. Tons neutros, marcenaria planejada e iluminação sofisticada tornam cada espaço harmonioso.",
  ),
  montarProjeto(
    "Salão Blush",
    "Salão Blush",
    "Comercial · Guaíra-SP · 2025 · 35 m²",
    "Projeto de interiores para salão de beleza, desenvolvido para traduzir a identidade da marca por meio de uma atmosfera acolhedora, elegante e funcional, proporcionando conforto e uma experiência única aos clientes.",
  ),
  montarProjeto(
    "Quarto Imagine",
    "Quarto Imagine",
    "Residencial · Guaíra-SP · 2026 · 9 m²",
    "Projetado para acompanhar o universo infantil, este dormitório combina funcionalidade, conforto e diversão em um ambiente acolhedor. A marcenaria planejada, a paleta de cores suaves e os detalhes lúdicos foram cuidadosamente pensados para estimular a imaginação da criança, criando um espaço agradável para brincar, estudar e descansar.",
  ),
];

export function ProjectsShowcase() {
  const [api, setApi] = useState<CarouselApi>();
  const [activeProject, setActiveProject] = useState(0);
  const [openProject, setOpenProject] = useState<Project | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const dragStart = useRef<{ x: number } | null>(null);
  const lastWheel = useRef(0);
  const modalWheel = useRef(0);
  const swipeX = useRef<number | null>(null);

  useEffect(() => {
    if (!api) return;

    const updateSelection = () => setActiveProject(api.selectedScrollSnap());
    updateSelection();
    api.on("select", updateSelection);
    api.on("reInit", updateSelection);

    return () => {
      api.off("select", updateSelection);
      api.off("reInit", updateSelection);
    };
  }, [api]);

  const showProject = (project: Project) => {
    setOpenProject(project);
    setActiveImage(0);
  };

  const changeImage = (direction: number) => {
    if (!openProject) return;
    setActiveImage(
      (current) => (current + direction + openProject.images.length) % openProject.images.length,
    );
  };

  const onTouchStart = (e: React.TouchEvent) => {
    swipeX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const x0 = swipeX.current;
    swipeX.current = null;
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) changeImage(dx < 0 ? 1 : -1);
  };

  return (
    <>
      <Carousel
        setApi={setApi}
        opts={{ align: "center", loop: true }}
        className="mx-auto mt-10 w-full md:max-w-[70%] sm:mt-14"
        aria-label="Projetos do Studio Uma"
        onWheel={(event) => {
          if (!api) return;
          const now = Date.now();
          if (now - lastWheel.current < 900) return;
          if (Math.abs(event.deltaX) > Math.abs(event.deltaY) && Math.abs(event.deltaX) > 10) {
            lastWheel.current = now;
            if (event.deltaX > 0) api.scrollNext();
            else api.scrollPrev();
          }
        }}
      >
        <CarouselContent className="-ml-3 md:-ml-6">
          {projects.map((project, index) => (
            <CarouselItem
              key={project.name}
              className="basis-[88%] pl-3 sm:basis-[62%] md:basis-[46%] md:pl-6 lg:basis-[38%]"
            >
              <Button
                type="button"
                variant="ghost"
                onClick={() => showProject(project)}
                className={`group h-auto w-full flex-col items-stretch whitespace-normal rounded-none p-0 text-left hover:bg-transparent ${
                  activeProject === index ? "opacity-100" : "opacity-55"
                }`}
                aria-label={`Abrir galeria do projeto ${project.name}`}
              >
                <span
                  className={`relative block aspect-[4/5] w-full overflow-hidden bg-muted transition-shadow duration-500 ${
                    activeProject === index
                      ? "shadow-[0_20px_45px_-12px_rgba(8,74,112,0.6)]"
                      : "shadow-none"
                  }`}
                >
                  <img
                    src={project.cover}
                      alt={`${project.name}`}
                    className={`h-full w-full object-cover transition duration-700 group-hover:scale-[1.025] ${
                      activeProject === index ? "scale-100" : "scale-[0.94]"
                    }`}
                    decoding="async" loading="lazy"
                    width={900}
                    height={1100}
                  />
                  <span className="absolute bottom-4 right-4 inline-flex h-11 w-11 items-center justify-center bg-primary text-navy-deep transition-transform group-hover:scale-105">
                    <Images className="h-4 w-4" />
                  </span>
                </span>
                <span className="block w-full pt-10 text-center">
                  <span className="font-heading text-2xl font-normal text-foreground sm:text-3xl">
                    {project.name}
                  </span>
                </span>
              </Button>
            </CarouselItem>
          ))}
        </CarouselContent>

        <div className="mt-16 flex items-center justify-center gap-5">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => api?.scrollPrev()}
            className="h-11 w-11 rounded-none border-navy/20 bg-background text-navy hover:border-primary hover:bg-primary"
            aria-label="Projeto anterior"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div
            className="flex items-center gap-2"
            aria-label={`Projeto ${activeProject + 1} de ${projects.length}`}
          >
            {projects.map((project, index) => (
              <Button
                key={project.name}
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => api?.scrollTo(index)}
                aria-label={`Ir para ${project.name}`}
                className={`h-2 min-h-0 rounded-full p-0 transition-all hover:bg-primary ${
                  activeProject === index ? "w-8 bg-primary" : "w-2 bg-navy/20"
                }`}
              />
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => api?.scrollNext()}
            className="h-11 w-11 rounded-none border-navy/20 bg-background text-navy hover:border-primary hover:bg-primary"
            aria-label="Próximo projeto"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </Carousel>

      <Dialog open={Boolean(openProject)} onOpenChange={(open) => !open && setOpenProject(null)}>
        <DialogContent
          showCloseButton={false}
          className="h-[90dvh] max-h-none w-[90vw] max-w-none gap-0 overflow-hidden rounded-2xl border-0 bg-background p-0 text-foreground"
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") changeImage(-1);
            if (event.key === "ArrowRight") changeImage(1);
          }}
        >
          {openProject && (
            <>
            <div className="relative flex h-full flex-col overflow-hidden">
              <img
                src={openProject.images[activeImage]}
                alt=""
                aria-hidden="true"
                className="fixed inset-0 hidden h-full w-full scale-110 object-cover opacity-15 blur-xl sm:block"
              />
              <div className="fixed inset-0 bg-background/90 sm:bg-background/75 sm:backdrop-blur-md" aria-hidden="true" />

              <div className="relative z-10 mx-auto flex h-full w-full max-w-7xl flex-col px-4 py-3 sm:px-6 sm:py-4">
                <header className="mb-2 flex items-center justify-between gap-4">
                  <div>
                      <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-primary sm:text-[10px]">
                        Projeto
                      </p>
                    <p className="mt-1 text-[10px] text-muted-foreground">
                      {String(activeImage + 1).padStart(2, "0")} /{" "}
                      {String(openProject.images.length).padStart(2, "0")}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setOpenProject(null)}
                    className="h-9 w-9 rounded-full border-border bg-card/80 text-navy shadow-sm backdrop-blur-md hover:border-primary hover:bg-primary"
                    aria-label="Fechar galeria"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </header>

                <div className="grid min-h-0 flex-1 gap-3 lg:grid-cols-[minmax(0,1.6fr)_minmax(280px,0.65fr)] lg:gap-5">
                  <div
                    className="relative h-[30dvh] min-h-0 touch-pan-y select-none overflow-hidden rounded-2xl border border-card/60 bg-muted shadow-2xl sm:h-[32dvh] lg:h-auto"
                    onTouchStart={onTouchStart}
                    onTouchEnd={onTouchEnd}
                    onPointerDown={(event) => {
                      if (event.pointerType !== "mouse") return;
                      dragStart.current = { x: event.clientX };
                    }}
                    onPointerUp={(event) => {
                      if (event.pointerType !== "mouse") return;
                      const s = dragStart.current;
                      dragStart.current = null;
                      if (!s) return;
                      const dx = event.clientX - s.x;
                      if (Math.abs(dx) > 60) changeImage(dx < 0 ? 1 : -1);
                    }}
                    onWheel={(event) => {
                      const now = Date.now();
                      if (now - modalWheel.current < 900) return;
                      if (
                        Math.abs(event.deltaX) > Math.abs(event.deltaY) &&
                        Math.abs(event.deltaX) > 10
                      ) {
                        modalWheel.current = now;
                        changeImage(event.deltaX > 0 ? 1 : -1);
                      }
                    }}
                  >
                    <img
                      src={openProject.images[activeImage]}
                      alt={`${openProject.name}, imagem ${activeImage + 1}`}
                      title="Arraste para navegar"
                      draggable={false}
                      className="absolute inset-0 h-full w-full object-contain"
                      width={1400}
                      height={1000}
                    />
                    <div
                      className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-navy-deep/55 to-transparent"
                      aria-hidden="true"
                    />
                    <div className="absolute inset-x-3 bottom-3 flex items-center justify-between sm:inset-x-4 sm:bottom-4">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => changeImage(-1)}
                        className="h-9 w-9 rounded-full border-navy-foreground/30 bg-navy-deep/70 text-navy-foreground backdrop-blur-md hover:bg-primary hover:text-primary-foreground"
                        aria-label="Imagem anterior"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="rounded-full bg-navy-deep/70 px-3 py-1.5 text-[8px] uppercase tracking-[0.2em] text-navy-foreground backdrop-blur-md">
                        Deslize ou arraste p/ navegar
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => changeImage(1)}
                        className="h-9 w-9 rounded-full border-navy-foreground/30 bg-navy-deep/70 text-navy-foreground backdrop-blur-md hover:bg-primary hover:text-primary-foreground"
                        aria-label="Próxima imagem"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <aside className="flex min-h-0 flex-col gap-3 overflow-y-auto pr-0.5">
                    <div className="rounded-2xl border border-card/70 bg-card/90 p-4 shadow-xl backdrop-blur-xl sm:p-5">
                      <DialogTitle className="font-heading text-2xl font-medium leading-tight text-navy sm:text-3xl">
                        {openProject.name}
                      </DialogTitle>
                      <DialogDescription className="sr-only">
                        Galeria de imagens do projeto {openProject.name}
                      </DialogDescription>
                      <p className="mt-2 text-[13px] leading-snug text-muted-foreground">
                        {openProject.description}
                      </p>
                      <div className="mt-3 border-y border-border py-3">
                        <div>
                          <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                            Detalhes
                          </p>
                          <p className="mt-1 text-xs font-medium text-navy">{openProject.detail}</p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-card/70 bg-card/80 p-3 shadow-lg backdrop-blur-xl">
                      <div className="mb-2 flex items-center justify-between">
                        <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-navy">
                          Imagens do projeto
                        </p>
                        <span className="text-[10px] text-muted-foreground">
                          {openProject.images.length} imagens
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-6 lg:grid-cols-3">
                        {openProject.images.map((image, index) => (
                          <Button
                            key={`${openProject.name}-${index}`}
                            type="button"
                            variant="ghost"
                            onClick={() => setActiveImage(index)}
                            className={`aspect-square h-auto w-full overflow-hidden rounded-lg p-0 transition-all ${
                              activeImage === index
                                ? "ring-2 ring-primary ring-offset-2 ring-offset-card"
                                : "opacity-60 hover:opacity-100"
                            }`}
                            aria-label={`Ver imagem ${index + 1}`}
                          >
                            <img
                              src={image}
                              alt=""
                              className="h-full w-full object-cover"
                              width={180}
                              height={180}
                            />
                          </Button>
                        ))}
                      </div>
                    </div>
                  </aside>
                </div>
              </div>
            </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
