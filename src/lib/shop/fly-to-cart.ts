/**
 * "Fly to cart" — clones the product image and arcs it into the header cart
 * icon (a plane-like trajectory), then pulses the cart. Pure DOM + Web
 * Animations API, so it runs independently of React re-renders.
 */
export function flyToCart(imgSrc: string, origin: { x: number; y: number }) {
  if (typeof document === "undefined") return;
  const target = document.getElementById("cart-fly-target");
  if (!target) return;

  const to = target.getBoundingClientRect();
  const toX = to.left + to.width / 2;
  const toY = to.top + to.height / 2;
  const size = 96;

  const img = document.createElement("img");
  img.src = imgSrc;
  img.alt = "";
  Object.assign(img.style, {
    position: "fixed",
    left: `${origin.x - size / 2}px`,
    top: `${origin.y - size / 2}px`,
    width: `${size}px`,
    height: `${size}px`,
    objectFit: "cover",
    borderRadius: "6px",
    zIndex: "9999",
    pointerEvents: "none",
    boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
    willChange: "transform, opacity",
  } as CSSStyleDeclaration);
  document.body.appendChild(img);

  const dx = toX - origin.x;
  const dy = toY - origin.y;

  const anim = img.animate(
    [
      { transform: "translate(0,0) scale(1) rotate(0deg)", opacity: 1 },
      { transform: `translate(${dx * 0.45}px, ${dy * 0.35 - 120}px) scale(0.7) rotate(-12deg)`, opacity: 1, offset: 0.55 },
      { transform: `translate(${dx}px, ${dy}px) scale(0.08) rotate(8deg)`, opacity: 0.2 },
    ],
    { duration: 850, easing: "cubic-bezier(0.55, -0.25, 0.35, 1)" },
  );

  anim.onfinish = () => {
    img.remove();
    target.animate(
      [{ transform: "scale(1)" }, { transform: "scale(1.3)" }, { transform: "scale(1)" }],
      { duration: 320, easing: "ease-out" },
    );
  };
}
