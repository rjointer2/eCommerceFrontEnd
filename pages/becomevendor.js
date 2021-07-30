
// hooks
import { useContext, useEffect, useRef, useState } from "react";

// apollo
import { useMutation, useQuery } from "@apollo/client"
import { GET_USER } from "../client/ulits/queries/userQueries"

// state management
import Context from "../client/store/context";
import { updateState } from "../client/store/actions";

// styles
import { Form, FormContainer, FormHeader } from "../client/styleComponents/form";
import { Text } from "../client/styleComponents/text";

// components
import ToggleSwitch from "../client/components/ToggleSwitch/ToggleSwitch";
import { ViewContainer } from "../client/styleComponents/aligment";
import { Img, ImgWrapper } from "../client/styleComponents/img";

// assets
import vendorSVG from '../assets/vendor.svg'
import { UPDATE_VENDOR_STATUS } from "../client/ulits/mutations/userMutations";




export default function BecomeVendor() {

    // local state
    const [vendor, setVendor] = useState(false)

    // global state
    const { state, dispatch } = useContext(Context);


    // get the user and cart
    const { data, error, loading } = useQuery(GET_USER);
    // update vendor status
    const [ updateVendorStatus ] = useMutation(UPDATE_VENDOR_STATUS, {
        onCompleted: () => window.location.assign('/')
    });

    const handleClick = async () => {
        try {
            await updateVendorStatus({ variables: { "userId": state.user } })
        } catch(err) {
            console.log(err)
        }
    }

    // track our renders
    const renderCount = useRef(0);

    useEffect(() => {
        renderCount.current = renderCount.current + 1;
        console.log(renderCount.current)

        
        if(!data) return false;
        dispatch(updateState(data.me.cart, data.me._id))
        setVendor(data.me.isVendor)
        console.log(vendor)
        console.log(state)
        
    }, [data])

    return (
        <div>
            <FormContainer>
                <ImgWrapper>
                    <Img src={vendorSVG} alt="vendor"/>
                </ImgWrapper>
                <Form>
                    <ViewContainer>
                    <Text lightText={true}>
                        { vendor ? 'Your already Vendor! Would Like to remove your status?' : 'Would you like to become a vendor?' }
                    </Text>
                    <ToggleSwitch stateValue={false} setStateValue={setVendor} callback={handleClick}  />
                    </ViewContainer>
                </Form>
            </FormContainer>
        </div>
    )
}
