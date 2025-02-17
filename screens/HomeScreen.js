import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Platform,
  ScrollView,
  Pressable,
  TextInput,
  Image,
  FlatList,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import React, { useState, useEffect, useCallback, useContext } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { AntDesign, Feather } from "@expo/vector-icons";
// import { SliderBox } from "react-native-image-slider-box";

import axios from "axios";
import ProductItem from "../components/ProductItem";
import DropDownPicker from "react-native-dropdown-picker";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { BottomModal, SlideAnimation, ModalContent } from "react-native-modals";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserType } from "../UserContext";

const HomeScreen = () => {
  const list = [
    {
      id: "0",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT20SzyLWRYAjxLPL1wt6gwC0NkpvrzXBgtVQ&s",
      name: "Lamp",
    },
    {
      id: "1",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJowdqpV6KE3spD6uSi9CaSdMDaCvXVlK2Kw&s",
      name: "Chair",
    },
    {
      id: "3",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSP2Y5vWtKmWhi6t16aszdW4Ps79KqjpuZBig&s",
      name: "Wardrobe",
    },
    {
      id: "4",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2n1L73Y1urchVrfcGMgbCM7B31q5WL0AhxQ&s",
      name: "Bed",
    },
    {
      id: "5",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRN8duC_vuln_SkMl2rnxaZ0dhFOLS9j6OLNA&s",
      name: "Carpet",
    },
    {
      id: "6",
      image: "https://m.media-amazon.com/images/I/71hg3l7PkHL.jpg",
      name: "Food Trolley",
    },
  ];

  const offers = [
    {
      id: "0",
      title:
        "Oppo Enco Air3 Pro True Wireless in Ear Earbuds with Industry First Composite Bamboo Fiber, 49dB ANC, 30H Playtime, 47ms Ultra Low Latency,Fast Charge,BT 5.3 (Green)",
      offer: "72% off",
      oldPrice: 7500,
      price: 4500,
      image:
        "https://m.media-amazon.com/images/I/61a2y1FCAJL._AC_UL640_FMwebp_QL65_.jpg",
      carouselImages: [
        "https://m.media-amazon.com/images/I/61a2y1FCAJL._SX679_.jpg",
        "https://m.media-amazon.com/images/I/71DOcYgHWFL._SX679_.jpg",
        "https://m.media-amazon.com/images/I/71LhLZGHrlL._SX679_.jpg",
        "https://m.media-amazon.com/images/I/61Rgefy4ndL._SX679_.jpg",
      ],
      color: "Green",
      size: "Normal",
    },
    {
      id: "1",
      title:
        "Fastrack Limitless FS1 Pro Smart Watch|1.96 Super AMOLED Arched Display with 410x502 Pixel Resolution|SingleSync BT Calling|NitroFast Charging|110+ Sports Modes|200+ Watchfaces|Upto 7 Days Battery",
      offer: "40%",
      oldPrice: 7955,
      price: 3495,
      image: "https://m.media-amazon.com/images/I/41mQKmbkVWL._AC_SY400_.jpg",
      carouselImages: [
        "https://m.media-amazon.com/images/I/71h2K2OQSIL._SX679_.jpg",
        "https://m.media-amazon.com/images/I/71BlkyWYupL._SX679_.jpg",
        "https://m.media-amazon.com/images/I/71c1tSIZxhL._SX679_.jpg",
      ],
      color: "black",
      size: "Normal",
    },
    {
      id: "2",
      title: "Aishwariya System On Ear Wireless On Ear Bluetooth Headphones",
      offer: "40%",
      oldPrice: 7955,
      price: 3495,
      image: "https://m.media-amazon.com/images/I/41t7Wa+kxPL._AC_SY400_.jpg",
      carouselImages: ["https://m.media-amazon.com/images/I/41t7Wa+kxPL.jpg"],
      color: "black",
      size: "Normal",
    },
    {
      id: "3",
      title:
        "Fastrack Limitless FS1 Pro Smart Watch|1.96 Super AMOLED Arched Display with 410x502 Pixel Resolution|SingleSync BT Calling|NitroFast Charging|110+ Sports Modes|200+ Watchfaces|Upto 7 Days Battery",
      offer: "40%",
      oldPrice: 24999,
      price: 19999,
      image: "https://m.media-amazon.com/images/I/71k3gOik46L._AC_SY400_.jpg",
      carouselImages: [
        "https://m.media-amazon.com/images/I/41bLD50sZSL._SX300_SY300_QL70_FMwebp_.jpg",
        "https://m.media-amazon.com/images/I/616pTr2KJEL._SX679_.jpg",
        "https://m.media-amazon.com/images/I/71wSGO0CwQL._SX679_.jpg",
      ],
      color: "Norway Blue",
      size: "8GB RAM, 128GB Storage",
    },
  ];

  const sampleAddresses = [
    {
      id: "1",
      name: "John Doe",
      houseNo: "123",
      landmark: "Near Park",
      street: "MG Road",
    },
    {
      id: "2",
      name: "Alice Smith",
      houseNo: "456",
      landmark: "Opposite Mall",
      street: "Brigade Road",
    },
    {
      id: "3",
      name: "Bob Johnson",
      houseNo: "789",
      landmark: "Next to Hospital",
      street: "Residency Road",
    },
  ];

  const navigation = useNavigation();

  const [products, setProducts] = useState([]); // Danh sách sản phẩm đang hiển thị
  const [page, setPage] = useState(1); // Trang hiện tại
  const [loading, setLoading] = useState(false); // Trạng thái tải dữ liệu
  const [hasMore, setHasMore] = useState(true);

  const [addresses, setAddresses] = useState([]);

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([{ label: "All", value: "all" }]);
  const [category, setCategory] = useState("all");

  const [openSort, setOpenSort] = useState(false);
  const [sortValue, setSortValue] = useState(null);
  const [sortOptions, setSortOptions] = useState([
    {
      label: "Giá tăng dần",
      value: "price_low",
      icon: () => <Ionicons name="arrow-upward" size={20} color="black" />,
    },
    {
      label: "Giá giảm dần",
      value: "price_high",
      icon: () => <Ionicons name="arrow-downward" size={20} color="black" />,
    },
  ]);

  const { userId, setUserId, token, setToken, refreshToken, setRefreshToken } = useContext(UserType);
  const [selectedAddress, setSelectedAdress] = useState("");
  console.log(selectedAddress)

  // Hàm lấy sản phẩm theo sắp xếp
  const fetchProducts = async (reset = false) => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const order = sortValue === "price_high" ? "desc" : "asc";
      console
      const response = await axios.get(
        `http://192.168.1.124:8080/api/v1/product/sort-by`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { products: newProducts } = response.data;

      if (newProducts.length === 0) {
        setHasMore(false);
      } else {
        setProducts((prev) => (reset ? newProducts : [...prev, ...newProducts]));
        setPage((prevPage) => prevPage + 1);
      }
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm:", error);
    } finally {
      setLoading(false);
    }
  };

  // Gọi API khi thay đổi sortValue
  useEffect(() => {
    setProducts([]); // Reset danh sách sản phẩm
    setPage(1);
    setHasMore(true);
    fetchProducts(true);
  }, [sortValue]);

  useEffect(() => {
    fetchProducts(); // Gọi API lần đầu khi component mount
  }, []);


  //    Category
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://192.168.1.124:8080/api/v1/category/getall");
        const categoryData = response.data.map((cat) => ({
          label: cat.name,
          value: cat.id.toString(),
        }));

        setItems([{ label: "All", value: "all" }, ...categoryData]);
      } catch (error) {
        console.error("❌ Lỗi khi lấy danh mục:", error);
      }
    };

    fetchCategories();
  }, []);

  const onDropdownOpen = useCallback(() => {
    setOpen(true);
  }, []);



  const cart = useSelector((state) => state.cart.cart);
  const [modalVisible, setModalVisible] = useState(false);
  useEffect(() => {
    if (userId) {
      fetchAddresses();
    }
  }, [userId, modalVisible]);
  const fetchAddresses = async () => {
    try {
      // const response = await axios.get(
      //   `http://localhost:8000/addresses/${userId}`
      // );
      // const { addresses } = response.data;

      setAddresses(sampleAddresses);
    } catch (error) {
      console.log("error", error);
    }
  };
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userId");
        const storedToken = await AsyncStorage.getItem("authToken");
        const storedRefreshToken = await AsyncStorage.getItem("refreshToken");
        console.log('123main', storedUserId)

        if (storedUserId) setUserId(storedUserId);
        if (storedToken) setToken(storedToken);
        if (storedRefreshToken) setRefreshToken(storedRefreshToken);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu từ AsyncStorage:", error);
      }
    };

    fetchUser();
  }, []);

  const renderHeader = () => (
    <View>
      <View
        style={{
          backgroundColor: "#878595",
          padding: 10,
          flexDirection: "row",
          alignItems: "center",
          paddingTop: 35,
          height: 100
        }}
      >
        <Pressable
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginHorizontal: 7,
            gap: 10,
            backgroundColor: "white",
            borderRadius: 3,
            height: 38,
            flex: 1,
          }}
        >
          <AntDesign
            style={{ paddingLeft: 10 }}
            name="search1"
            size={22}
            color="black"
          />
          <TextInput placeholder="Search Amazon.in" />
        </Pressable>

        <Feather name="mic" size={24} color="black" />
      </View>
      {/* <Pressable
            onPress={() => setModalVisible(!modalVisible)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              padding: 10,
              backgroundColor: "#AFEEEE",
            }}
          >
            <Ionicons name="location-outline" size={24} color="black" />

            <Pressable>
              {selectedAddress ? (
                <Text>
                  Deliver to {selectedAddress?.name} - {selectedAddress?.street}
                </Text>
              ) : (
                <Text style={{ fontSize: 13, fontWeight: "500" }}>
                  Add a Address
                </Text>
              )}
            </Pressable>

            <Ionicons name="keyboard-arrow-down" size={24} color="black" />
          </Pressable> */}

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {list.map((item, index) => (
          <Pressable
            key={index}
            style={{
              margin: 10,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              style={{
                width: 50,
                height: 50,
                borderRadius: 25, // Bán kính = 1/2 chiều rộng/chiều cao để tạo hình tròn
                resizeMode: "cover", // Để ảnh lấp đầy hình tròn mà không bị méo
                overflow: "hidden", // Đảm bảo ảnh không tràn ra ngoài
              }}
              source={{ uri: item.image }}
            />

            <Text
              style={{
                textAlign: "center",
                fontSize: 12,
                fontWeight: "500",
                marginTop: 5,
              }}
            >
              {item?.name}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* <SliderBox
            images={images}
            autoPlay
            circleLoop
            dotColor={"#13274F"}
            inactiveDotColor="#90A4AE"
            ImageComponentStyle={{ width: "100%" }}
          /> */}

      {/* Top deal of the week */}
      {/* <Carousel
            loop
            autoPlay
            data={images}
            width={width_image.width}
            height={200}
            renderItem={({ item }) => (
              <Image source={{ uri: item }} style={{ width: "100%", height: 200 }} />
            )}
          />

          <Text style={{ padding: 10, fontSize: 18, fontWeight: "bold" }}>
            Trending Deals of the week
          </Text>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            {deals.map((item, index) => (
              <Pressable
                key={index}
                onPress={() =>
                  navigation.navigate("Info", {
                    id: item.id,
                    title: item.title,
                    price: item?.price,
                    carouselImages: item.carouselImages,
                    color: item?.color,
                    size: item?.size,
                    oldPrice: item?.oldPrice,
                    item: item,
                  })
                }
                style={{
                  marginVertical: 10,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Image
                  style={{ width: 180, height: 180, resizeMode: "contain" }}
                  source={{ uri: item?.image }}
                />
              </Pressable>
            ))}
          </View> */}

      <View style={{ flexDirection: "row", justifyContent: "space-between", marginHorizontal: 10 }}>

        {/* Category list */}
        <View
          style={{
            marginHorizontal: 10,
            marginTop: 20,
            width: "45%",
            marginBottom: open ? 50 : 15,
          }}
        >
          <Text style={{ fontSize: 13, marginBottom: 5, marginLeft: 5, fontWeight: "bold" }}>
            Category
          </Text>
          <DropDownPicker
            style={{
              borderColor: "#B7B7B7",
              height: 20,
              marginBottom: open ? 50 : 15,
            }}
            open={open}
            value={category} //genderValue
            items={items}
            setOpen={setOpen}
            setValue={setCategory}
            setItems={setItems}
            placeholder="choose category"
            placeholderStyle={styles.placeholderStyles}
            onOpen={onDropdownOpen}
            // onChangeValue={onChange}
            zIndex={3000}
            zIndexInverse={1000}
            dropDownDirection="BOTTOM" // Hiển thị dropdown xuống dưới
            listMode="SCROLLVIEW" // Cho phép scroll nếu danh sách dài
            maxHeight={250}
          />
        </View>

        {/* Sort */}
        <View style={{ marginHorizontal: 10, marginTop: 20, width: "30%" }}>
          <Text style={{ fontSize: 13, marginBottom: 5, marginLeft: 5, fontWeight: "bold" }}>
            Sort
          </Text>
          <DropDownPicker
            style={{ borderColor: "#B7B7B7", height: 40 }}
            open={openSort}
            value={sortValue}
            items={sortOptions}
            setOpen={setOpenSort}
            setValue={setSortValue}
            placeholder="Sắp xếp"
            placeholderStyle={{ color: "#999" }}
            dropDownDirection="BOTTOM"
            listMode="SCROLLVIEW"
            maxHeight={250}
            showTickIcon={false}
          />
        </View>
      </View>



      <Text
        style={{
          height: 1,
          borderColor: "#D0D0D0",
          borderWidth: 2,
          marginTop: 15,
        }}
      />

      <Text style={{ padding: 10, fontSize: 18, fontWeight: "bold" }}>
        Today's Deals
      </Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {offers.map((item, index) => (
          <Pressable
            key={index}
            onPress={() =>
              navigation.navigate("Info", {
                id: item.id,
                title: item.title,
                price: item?.price,
                carouselImages: item.carouselImages,
                color: item?.color,
                size: item?.size,
                oldPrice: item?.oldPrice,
                item: item,
              })
            }
            style={{
              marginVertical: 10,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              style={{ width: 150, height: 150, resizeMode: "contain" }}
              source={{ uri: item?.image }}
            />

            <View
              style={{
                backgroundColor: "#E31837",
                paddingVertical: 5,
                width: 130,
                justifyContent: "center",
                alignItems: "center",
                marginTop: 10,
                borderRadius: 4,
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  color: "white",
                  fontSize: 13,
                  fontWeight: "bold",
                }}
              >
                Upto {item?.offer}
              </Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      <Text
        style={{
          height: 1,
          borderColor: "#D0D0D0",
          borderWidth: 2,
          marginTop: 15,
        }}
      />


    </View>
  );
  return (
    <>
      <SafeAreaView
        style={{
          paddinTop: Platform.OS === "android" ? 40 : 0,
          flex: 1,
          backgroundColor: "white",
          // padding : 20,
        }}
              open={open}
              value={category} //genderValue
              items={items}
              setOpen={setOpen}
              setValue={setCategory}
              setItems={setItems}
              placeholder="choose category"
              placeholderStyle={styles.placeholderStyles}
              onOpen={onGenderOpen}
              // onChangeValue={onChange}
              zIndex={3000}
              zIndexInverse={1000}
            />
          )}
        </View>

      </SafeAreaView >

      <BottomModal
        onBackdropPress={() => setModalVisible(!modalVisible)}
        swipeDirection={["up", "down"]}
        swipeThreshold={200}
        modalAnimation={
          new SlideAnimation({
            slideFrom: "bottom",
          })
        }
        onHardwareBackPress={() => setModalVisible(!modalVisible)}
        visible={modalVisible}
        onTouchOutside={() => setModalVisible(!modalVisible)}
      >
        <ModalContent style={{ width: "100%", height: 400 }}>
          <View style={{ marginBottom: 8 }}>
            <Text style={{ fontSize: 16, fontWeight: "500" }}>
              Choose your Location
            </Text>

            <Text style={{ marginTop: 5, fontSize: 16, color: "gray" }}>
              Select a delivery location to see product availabilty and delivery
              options
            </Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {/* already added addresses */}
            {addresses?.map((item, index) => (
              <Pressable
                key={index}
                onPress={() => setSelectedAdress(item)}
                style={{
                  width: 140,
                  height: 140,
                  borderColor: "#D0D0D0",
                  borderWidth: 1,
                  padding: 10,
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 3,
                  marginRight: 15,
                  marginTop: 10,
                  backgroundColor: selectedAddress === item ? "#FBCEB1" : "white"
                }}
              >
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 3 }}
                >
                  <Text style={{ fontSize: 13, fontWeight: "bold" }}>
                    {item?.name}
                  </Text>
                  <Entypo name="location-pin" size={24} color="red" />
                </View>

                <Text
                  numberOfLines={1}
                  style={{ width: 130, fontSize: 13, textAlign: "center" }}
                >
                  {item?.houseNo},{item?.landmark}
                </Text>

                <Text
                  numberOfLines={1}
                  style={{ width: 130, fontSize: 13, textAlign: "center" }}
                >
                  {item?.street}
                </Text>
                <Text
                  numberOfLines={1}
                  style={{ width: 130, fontSize: 13, textAlign: "center" }}
                >
                  India, Bangalore
                </Text>
              </Pressable>
            ))}

            <Pressable
              onPress={() => {
                setModalVisible(false);
                navigation.navigate("Address");
              }}
              style={{
                width: 140,
                height: 140,
                borderColor: "#D0D0D0",
                marginTop: 10,
                borderWidth: 1,
                padding: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  color: "#0066b2",
                  fontWeight: "500",
                }}
              >
                Add an Address or pick-up point
              </Text>
            </Pressable>
          </ScrollView>

          <View style={{ flexDirection: "column", gap: 7, marginBottom: 30 }}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            >
              <Entypo name="location-pin" size={22} color="#0066b2" />
              <Text style={{ color: "#0066b2", fontWeight: "400" }}>
                Enter an Indian pincode
              </Text>
            </View>

            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            >
              <Ionicons name="locate-sharp" size={22} color="#0066b2" />
              <Text style={{ color: "#0066b2", fontWeight: "400" }}>
                Use My Currect location
              </Text>
            </View>

            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            >
              <AntDesign name="earth" size={22} color="#0066b2" />

              <Text style={{ color: "#0066b2", fontWeight: "400" }}>
                Deliver outside India
              </Text>
            </View>
          </View>
        </ModalContent>
      </BottomModal>
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
