// Floating CTA Button Component
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import Tooltip from "@mui/material/Tooltip";

// Material Kit 2 PRO React components
import MKBox from "components/MKBox";
import MKButton from "components/MKButton";
import MKTypography from "components/MKTypography";

function FloatingCTA() {
  const [showButton, setShowButton] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show floating button after scrolling 500px
      if (window.scrollY > 500) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }

      // Show banner after scrolling 1500px
      if (window.scrollY > 1500) {
        setShowBanner(true);
      } else {
        setShowBanner(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Floating Action Buttons */}
      <AnimatePresence>
        {showButton && (
          <MKBox
            sx={{
              position: "fixed",
              bottom: 20,
              right: 20,
              zIndex: 1000,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {/* Main CTA Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <Tooltip title="Get started for free" placement="left">
                <Fab
                  href="/join"
                  sx={{
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "white",
                    width: 64,
                    height: 64,
                    boxShadow: "0 8px 30px rgba(102, 126, 234, 0.4)",
                    "&:hover": {
                      background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
                      boxShadow: "0 12px 40px rgba(102, 126, 234, 0.6)",
                      transform: "scale(1.1)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  <MKTypography variant="h5" color="white" fontWeight="bold">
                    🚀
                  </MKTypography>
                </Fab>
              </Tooltip>
            </motion.div>

            {/* Secondary Demo Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0, y: 20 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Tooltip title="Schedule a demo" placement="left">
                <Fab
                  size="small"
                  href="/demo"
                  sx={{
                    backgroundColor: "white",
                    color: "#667eea",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                    "&:hover": {
                      backgroundColor: "#f5f5f5",
                      boxShadow: "0 6px 25px rgba(0, 0, 0, 0.15)",
                      transform: "scale(1.1)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  <MKTypography variant="body1" fontWeight="bold">
                    📅
                  </MKTypography>
                </Fab>
              </Tooltip>
            </motion.div>

            {/* Scroll to Top Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0, y: 20 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Tooltip title="Back to top" placement="left">
                <Fab
                  size="small"
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  sx={{
                    backgroundColor: "white",
                    color: "#667eea",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                    "&:hover": {
                      backgroundColor: "#f5f5f5",
                      boxShadow: "0 6px 25px rgba(0, 0, 0, 0.15)",
                      transform: "scale(1.1)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  <MKTypography variant="body1" fontWeight="bold">
                    ↑
                  </MKTypography>
                </Fab>
              </Tooltip>
            </motion.div>
          </MKBox>
        )}
      </AnimatePresence>

      {/* Sticky Bottom Banner */}
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.5 }}
          >
            <MKBox
              sx={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 999,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                boxShadow: "0 -4px 20px rgba(0, 0, 0, 0.2)",
                p: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  maxWidth: "1200px",
                  margin: "0 auto",
                  flexWrap: "wrap",
                  gap: 2,
                }}
              >
                {/* Left Content */}
                <MKBox sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <MKTypography variant="h6" color="white" fontWeight="bold">
                    Ready to Transform Your Practice?
                  </MKTypography>
                  <MKTypography
                    variant="body2"
                    color="white"
                    opacity={0.9}
                    sx={{ display: { xs: "none", md: "block" } }}
                  >
                    Join 50+ clinics saving 10+ hours monthly
                  </MKTypography>
                </MKBox>

                {/* Right Buttons */}
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  <MKButton
                    variant="contained"
                    color="white"
                    href="/join"
                    sx={{
                      color: "#667eea",
                      fontWeight: "bold",
                      px: 3,
                      "&:hover": {
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    Start Free Trial
                  </MKButton>
                  <MKButton
                    variant="outlined"
                    color="white"
                    href="/demo"
                    sx={{
                      borderWidth: "2px",
                      fontWeight: "bold",
                      px: 3,
                      "&:hover": {
                        borderWidth: "2px",
                        backgroundColor: "rgba(255,255,255,0.1)",
                      },
                    }}
                  >
                    Book Demo
                  </MKButton>

                  {/* Close Button */}
                  <Fab
                    size="small"
                    onClick={() => setShowBanner(false)}
                    sx={{
                      backgroundColor: "rgba(255,255,255,0.2)",
                      color: "white",
                      minWidth: "40px",
                      width: "40px",
                      height: "40px",
                      "&:hover": {
                        backgroundColor: "rgba(255,255,255,0.3)",
                      },
                    }}
                  >
                    ✕
                  </Fab>
                </Box>
              </Box>
            </MKBox>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default FloatingCTA;
