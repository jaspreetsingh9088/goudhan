import React from "react";

const Aboutus = () => {
  return (
    <div
      className="relative flex min-h-screen flex-col bg-white overflow-x-hidden"
      style={{
        fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif',
      }}
    >
      <div className="layout-container flex flex-col h-full grow">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-[#f4f2f1] px-10 py-3">
          <div className="flex items-center gap-4 text-[#171412]">
            <div className="size-4">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M4 42.4379C4 42.4379 14.0962 36.0744 24 41.1692C35.0664 46.8624 44 42.2078 44 42.2078L44 7.01134C44 7.01134 35.068 11.6577 24.0031 5.96913C14.0971 0.876274 4 7.27094 4 7.27094L4 42.4379Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <h2 className="text-lg font-bold tracking-[-0.015em]">Goudhan</h2>
          </div>
          <div className="flex flex-1 justify-end gap-8">
            <nav className="flex items-center gap-9 text-sm font-medium text-[#171412]">
              <a href="#">Home</a>
              <a href="#">Products</a>
              <a href="#">About Us</a>
              <a href="#">Contact</a>
            </nav>
            <div className="flex gap-2">
              <button className="flex h-10 min-w-[84px] px-4 items-center justify-center rounded-xl bg-[#f3e3d7] text-sm font-bold tracking-[0.015em] text-[#171412]">
                Register
              </button>
              <button className="flex h-10 min-w-[84px] px-4 items-center justify-center rounded-xl bg-[#f4f2f1] text-sm font-bold tracking-[0.015em] text-[#171412]">
                Login
              </button>
              <button className="flex h-10 px-2.5 items-center justify-center rounded-xl bg-[#f4f2f1] text-sm font-bold text-[#171412]">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M222.14,58.87A8,8,0,0,0,216,56H54.68L49.79,29.14A16,16,0,0,0,34.05,16H16a8,8,0,0,0,0,16h18L59.56,172.29a24,24,0,0,0,5.33,11.27,28,28,0,1,0,44.4,8.44h45.42A27.75,27.75,0,0,0,152,204a28,28,0,1,0,28-28H83.17a8,8,0,0,1-7.87-6.57L72.13,152h116a24,24,0,0,0,23.61-19.71l12.16-66.86A8,8,0,0,0,222.14,58.87ZM96,204a12,12,0,1,1-12-12A12,12,0,0,1,96,204Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,192,204Zm4-74.57A8,8,0,0,1,188.1,136H69.22L57.59,72H206.41Z" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        <main className="px-40 py-5 flex justify-center flex-1">
          <div className="layout-content-container flex flex-col max-w-[960px] w-full">
            <div className="bg-cover bg-center flex flex-col justify-end min-h-80 rounded-xl overflow-hidden"
              style={{
                backgroundImage:
                  `linear-gradient(0deg, rgba(0, 0, 0, 0.4), transparent 25%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuC6XcqeeF2W9wylCSbBWlzGMhTp6gueowCbWFVLhtGIoSvom2G1YWuJo5Eldt-d6HRhUZEeTbY_wYhFzepKBjnnNi9ypMeaBQJaltyFFknOsURS8PZ2tsQsGtWylxwcVSYy_tyaZFKv3NWn7QRb5WKgt04wlGKJRmrdncJ67sK942FedO3CiUZ_8ZJnIZ2wwAaz9h4zjv7yOJoCAvFbtLRq5Ptp7xG8dTLiU4sxdanOBU6CLz-lzXn-AqE-T0Oh-U_V-HF6wLLUZZU")`,
              }}
            >
              <div className="p-4">
                <p className="text-white text-[28px] font-bold leading-tight">
                  Experience the Purity of Cow Products
                </p>
              </div>
            </div>

            <h2 className="text-[22px] font-bold pt-5 pb-3 px-4 text-[#171412] tracking-[-0.015em]">
              Our Products
            </h2>

            <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">
              {[
                {
                  title: "Fresh Milk",
                  description: "Daily fresh milk sourced directly from our healthy cows",
                  image:
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuBw1TxT6JPoVo_H43ukeKUj3kOJf8CBfnTzHRPQwQ9fqCbaWwZlfOKFa9LB2dHrlyI46FKJSu79yYkEcA5GvfHxO4WKJ8MnTn_7600dYLcfRLupkfDUI5-3pCYVA36ZCh0pLR5UvTsf8om4EENJax6rhWqEbNOMoaKTO20jL9YepOLg87fe91H09qhe1YBSh4uMVpMDXPjWktY_7ArF6NDH3_lclq_cUchz2ob6ayWbyQyo9XRrlx_MAe8b4Rh9xiIprceINzxw_Io",
                },
                {
                  title: "Milk Products",
                  description:
                    "Explore our range of milk products including cheese, yogurt, and more",
                  image:
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuBjIHIS2zYmvCWYZGm_wbG-BjwCmJLlG0XgDjHw62EwdfxHkuw0yJWifL-XxpaNsaSccHEFBtpvPYdV8p47KFdKmWGXG-Qyix6Y3p1NcpWZKVe5ZIG3qjnIJnFPT-9YQlCVz284ftWfOEK5zHLt-sNQC7UcIILtURgVfLUroE2rX1c69-e69mhshDKoX3NmAMVMuV7IMWjyCfoDq9ec4E6SjW7eLR-wQXrWK62ciQZUSrnYgw0f6mHkju2ZJn2M_9SMpXWSo-w6fTQ",
                },
                {
                  title: "Gokand",
                  description:
                    "Discover traditional Gokand products made with care and expertise",
                  image:
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuDu34e7jyaS2nu1gQslI983yaaj2kziDu5_tGYdB-NwfplTeUXt-LWN3g4rWxTyf0TuXGu4dIFJVJAOzBrV8Ji2_-DhRCpGyavWw1ythKe6FSIr6bsIKIDzbpWFo2AOoaUviKbsRs3dAso5NwfEp_tMmKM8DRtz1GkEptB6pLdeiu-wCQVLv9zHBGfWf9po4cmJvpczu0wdrctd7vp6MlxefvfG8A35tymThSuINbO_fYb-lcV20lBCMQQFvafajKO9mVi-yRl-7JA",
                },
              ].map((product, index) => (
                <div key={index} className="flex flex-col gap-3 pb-3">
                  <div
                    className="w-full aspect-square bg-center bg-cover rounded-xl"
                    style={{ backgroundImage: `url("${product.image}")` }}
                  ></div>
                  <div>
                    <p className="text-[#171412] text-base font-medium">{product.title}</p>
                    <p className="text-[#827468] text-sm">{product.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Aboutus;
