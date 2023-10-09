/*
 * Copyright (c) 2022-2023  Physikalisch-Technische Bundesanstalt (PTB), all rights reserved.
 * This source code and software is free software: you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public License as published
 * by the Free Software Foundation, version 3 of the License.
 * The software is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 * You should have received a copy of the GNU Lesser General Public License
 * along with this Code.  If not, see http://www.gnu.org/licenses.
 * CONTACT: 		info@ptb.de
 * DEVELOPMENT:		https://d-si.ptb.de
 * AUTHORS:		Wafa El Jaoua, Tobias Hoffmann, Clifford Brown, Daniel Hutzschenreuter
 * LAST MODIFIED:		 06.10.23, 23:35
 */

package de.ptb.codataapi.model;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;
import java.io.Serializable;

/**
 * Pojo for participant
 * @author Wafa El jaoua
 */
@Getter
@Setter
@AllArgsConstructor
@ToString
@EqualsAndHashCode
public class Participant implements Serializable {
    static long instanceCounter=0;

    @Schema(name = "id", example = "1")
    private  Long  id;
    @Schema(name = "name", example = "NPL")
    private  String name;
    @Schema(name = "pidDCC", example = "CCM.M-K1-NPL9507")
    private String  pidDCC;
    public Participant() {
        instanceCounter++;
        id=instanceCounter;
    }

}