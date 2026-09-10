const elements = {
  name: document.getElementById("profileName"), role: document.getElementById("profileRole"),
  company: document.getElementById("profileCompany"), address: document.getElementById("profileAddress"),
  contacts: document.getElementById("contactList"), photoWrap: document.getElementById("profilePhotoWrap"),
  photo: document.getElementById("profilePhoto"), save: document.getElementById("saveContact"),
  call: document.getElementById("callButton"), email: document.getElementById("emailButton"),
  share: document.getElementById("shareButton"), qr: document.getElementById("profileQr"),
  mobileQr: document.getElementById("mobileProfileQr")
};
let activeProfile;
let vcardUrl;

const formatPhone = (phone) => {
  const digits = phone.replace(/\D/g, "");
  return digits.startsWith("94") && digits.length === 11
    ? `(+94) ${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}` : phone;
};

const contactRow = (label, content) => {
  const row = document.createElement("div");
  row.className = "contact-item";
  row.dataset.type = label.toLowerCase();
  const term = document.createElement("dt");
  const detail = document.createElement("dd");
  term.textContent = label;
  detail.append(content);
  row.append(term, detail);
  return row;
};

function makeVcard(profile) {
  const parts = profile.name.trim().split(/\s+/);
  const lastName = parts.pop() || "";
  const lines = [
    "BEGIN:VCARD", "VERSION:3.0", `N:${lastName};${parts.join(" ")};;;`, `FN:${profile.name}`,
    `ORG:${profile.company}`, `TITLE:${profile.title || ""}`,
    ...(profile.phones || []).map((phone) => `TEL;TYPE=CELL:${phone}`),
    ...(profile.email ? [`EMAIL;TYPE=WORK:${profile.email}`] : []),
    ...(profile.website ? [`URL:${profile.website}`] : []), "END:VCARD"
  ];
  return new Blob([lines.join("\r\n")], { type: "text/vcard" });
}

function renderProfile(profile) {
  activeProfile = profile;
  elements.name.textContent = profile.name;
  elements.role.textContent = profile.title || "Welford Systems";
  elements.company.textContent = profile.company;
  elements.address.textContent = profile.address || "";
  elements.contacts.replaceChildren();
  if (profile.phones?.length) {
    const phones = document.createDocumentFragment();
    profile.phones.forEach((phone, index) => {
      if (index) phones.append(Object.assign(document.createElement("span"), { className: "separator", textContent: "/" }));
      const link = document.createElement("a");
      link.href = `tel:${phone}`;
      link.textContent = formatPhone(phone);
      phones.append(link);
    });
    elements.contacts.append(contactRow("Mobile", phones));
  }
  if (profile.email) {
    const link = document.createElement("a");
    link.href = `mailto:${profile.email}`;
    link.textContent = profile.email;
    elements.contacts.append(contactRow("Email", link));
  }
  if (profile.website) {
    const link = document.createElement("a");
    link.href = profile.website;
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = profile.website.replace(/^https?:\/\//, "");
    elements.contacts.append(contactRow("Web", link));
  }
  elements.photoWrap.hidden = !profile.photo;
  if (profile.photo) {
    elements.photo.src = profile.photo;
    elements.photo.alt = `${profile.name} profile photo`;
  }
  elements.qr.src = profile.qrCode;
  elements.qr.alt = `QR code for ${profile.name}'s digital business card`;
  elements.mobileQr.src = profile.qrCode;
  elements.mobileQr.alt = `QR code for ${profile.name}'s digital business card`;
  elements.call.hidden = !profile.phones?.length;
  elements.call.href = profile.phones?.length ? `tel:${profile.phones[0]}` : "#";
  elements.email.hidden = !profile.email;
  elements.email.href = profile.email ? `mailto:${profile.email}` : "#";
  if (vcardUrl) URL.revokeObjectURL(vcardUrl);
  vcardUrl = URL.createObjectURL(makeVcard(profile));
  elements.save.href = vcardUrl;
  elements.save.download = `${profile.id}.vcf`;
  document.title = `${profile.name} | Welford Systems`;
}

async function init() {
  try {
    const response = await fetch("profile-data.json");
    if (!response.ok) throw new Error("Could not load profiles");
    const data = await response.json();
    const route = location.pathname.split("/").filter(Boolean).pop();
    const requested = new URLSearchParams(location.search).get("profile") || route;
    renderProfile(data.profiles.find((profile) => profile.id === requested || profile.profileUrl.endsWith(`/${requested}`)) ||
      data.profiles.find((profile) => profile.id === data.defaultProfile) || data.profiles[0]);
  } catch (error) {
    elements.name.textContent = "Profiles unavailable";
    elements.role.textContent = "Please run this site through a local web server.";
    console.error(error);
  }
}

elements.share.addEventListener("click", async () => {
  const shareData = {
    title: `${activeProfile.name} | Welford Systems`,
    text: `${activeProfile.name}${activeProfile.title ? ` — ${activeProfile.title}` : ""}, Welford Systems`,
    url: activeProfile.profileUrl
  };
  if (navigator.share) {
    try { await navigator.share(shareData); return; }
    catch (error) { if (error?.name === "AbortError") return; }
  }
  try {
    await navigator.clipboard.writeText(activeProfile.profileUrl);
    const original = elements.share.textContent;
    elements.share.textContent = "Link copied";
    setTimeout(() => { elements.share.textContent = original; }, 1800);
  } catch { window.prompt("Copy this link:", activeProfile.profileUrl); }
});

init();
