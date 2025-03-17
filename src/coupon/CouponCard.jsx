import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, Typography, Button, Grid, CircularProgress, Container } from "@mui/material";

const CouponCard = () => {
    const [coupons, setCoupons] = useState([]);
    const [claimedCoupons, setClaimedCoupons] = useState(new Set());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        try {
            const response = await axios.get("http://localhost:5000/coupons");
            setCoupons(response.data.coupons);
        } catch (error) {
            console.error("Error fetching coupons:", error);
        } finally {
            setLoading(false);
        }
    };

    const claimCoupon = async (couponId) => {
        const browserCookie = localStorage.getItem("browser_cookie") || `cookie_${Math.random()}`;
        localStorage.setItem("browser_cookie", browserCookie);

        try {
            const response = await axios.post("http://localhost:5000/claim", { browser_cookie: browserCookie });
            alert(response.data.message);
            setClaimedCoupons((prev) => new Set(prev).add(couponId));
        } catch (error) {
            alert(error.response?.data?.error || "Failed to claim coupon.");
        }
    };

    return (
        <Container>
            <Typography variant="h4" align="center" sx={{ margin: "20px 0", fontWeight: "bold", color: "#333" }}>
                🎟️ Exclusive Coupons
            </Typography>

            {loading ? (
                <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
                    <CircularProgress />
                </div>
            ) : (
                <Grid container spacing={3} justifyContent="center">
                    {coupons.length > 0 ? (
                        coupons.map((coupon) => (
                            <Grid item xs={12} sm={6} md={4} key={coupon.id}>
                                <Card
                                    sx={{
                                        background: "linear-gradient(135deg, #f9f6f2, #fff)",
                                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                                        borderRadius: "12px",
                                        padding: 2,
                                        position: "relative",
                                        overflow: "hidden",
                                    }}
                                >
                                    <CardContent>
                                        <Grid container alignItems="center" justifyContent="space-between">
                                            <Grid item>
                                                <Typography
                                                    variant="h6"
                                                    sx={{
                                                        fontWeight: "bold",
                                                        color: "#333",
                                                        backgroundColor: "#f8d57e",
                                                        padding: "5px 12px",
                                                        borderRadius: "6px",
                                                    }}
                                                >
                                                    {coupon.code}
                                                </Typography>
                                            </Grid>
                                            <Grid item>
                                                <Button
                                                    variant="contained"
                                                    sx={{
                                                        backgroundColor: claimedCoupons.has(coupon.id) ? "#28a745" : "#1e3a8a",
                                                        "&:hover": { backgroundColor: claimedCoupons.has(coupon.id) ? "#218838" : "#162d5d" },
                                                        color: "#fff",
                                                        fontWeight: "bold",
                                                        borderRadius: "20px",
                                                        textTransform: "none",
                                                    }}
                                                    onClick={() => claimCoupon(coupon.id)}
                                                    disabled={claimedCoupons.has(coupon.id)}
                                                >
                                                    {claimedCoupons.has(coupon.id) ? "Claimed" : "Claim"}
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))
                    ) : (
                        <Typography align="center" variant="body1">
                            No coupons available
                        </Typography>
                    )}
                </Grid>
            )}
        </Container>
    );
};

export default CouponCard;
