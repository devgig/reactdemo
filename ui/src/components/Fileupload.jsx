import React, {PureComponent} from 'react';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    Container,
    Row,
    Col,
    Jumbotron,
    Button
} from 'reactstrap';

class Fileupload extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            hasError: false
        };
    }

    render() {
        if (this.state.hasError) {
            return <h1>Something went wrong.</h1>;
        }
        return (
            <Jumbotron>
                <Container>
                    <Row>
                        <Col>
                            <h3>Upload file(s)</h3>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <div class="box content">
                                <div>
                                    <form
                                        action="/api/images/upload"
                                        class="dropzone needsclick dz-clickable"
                                        id="image-upload"
                                        method="post"
                                        enctype="multipart/form">

                                        <div class="dz-message needsclick">
                                            <span class="note needsclick">
                                                Drop files here or click to upload.
                                            </span>
                                        </div>
                                    </form>
                                </div>
                            </div>

                        </Col>
                    </Row>
                </Container>
            </Jumbotron>

        );
    }
}

export default Fileupload;
